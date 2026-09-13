// Unified TTS Engine supporting Android Native TextToSpeech and Web Speech Synthesis

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentNativeUtteranceId: string | null = null;
let activeBoundaryCallback: ((charIndex: number) => void) | null = null;
let simulatedBoundaryTimer: NodeJS.Timeout | null = null;
let nativeTTSResolvers: Map<string, { resolve: () => void; reject: (err: any) => void }> = new Map();

// Initialize native TTS callbacks on window once
if (typeof window !== 'undefined') {
  window.onNativeTTSDone = (utteranceId: string) => {
    const callbacks = nativeTTSResolvers.get(utteranceId);
    if (callbacks) {
      callbacks.resolve();
      nativeTTSResolvers.delete(utteranceId);
    }
    if (currentNativeUtteranceId === utteranceId) {
      currentNativeUtteranceId = null;
      activeBoundaryCallback = null;
    }
  };

  window.onNativeTTSError = (utteranceId: string, err: string) => {
    const callbacks = nativeTTSResolvers.get(utteranceId);
    if (callbacks) {
      callbacks.reject(new Error(err || 'Native TTS error'));
      nativeTTSResolvers.delete(utteranceId);
    }
    if (currentNativeUtteranceId === utteranceId) {
      currentNativeUtteranceId = null;
      activeBoundaryCallback = null;
    }
  };

  window.onNativeTTSBoundary = (utteranceId: string, charIndex: number) => {
    if (activeBoundaryCallback && currentNativeUtteranceId === utteranceId) {
      activeBoundaryCallback(charIndex);
    }
  };
}

export function isAndroidNativeTTS(): boolean {
  return typeof window !== 'undefined' &&
    !!(window.AndroidNativeShell?.speak && typeof window.AndroidNativeShell.speak === 'function');
}

export function getTTSEngineType(): 'android_native' | 'web_speech' {
  return isAndroidNativeTTS() ? 'android_native' : 'web_speech';
}

export function isTTSAvailable(): boolean {
  if (isAndroidNativeTTS()) return true;
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Retrieves available system voices, optionally filtered by language code.
 */
export function getAvailableVoices(langCode?: string): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!langCode) return voices;

    const clean = normalizeLanguageCode(langCode).toLowerCase();
    const prefix = clean.split('-')[0];

    // Priority: Exact match, then prefix match
    const matching = voices.filter(
      (v) => v.lang.toLowerCase() === clean || v.lang.toLowerCase().startsWith(prefix)
    );

    return matching.length > 0 ? matching : voices;
  } catch {
    return [];
  }
}

/**
 * Normalizes language codes (e.g. "es_auto" -> "es", "zh-CN" -> "zh-CN")
 */
export function normalizeLanguageCode(code: string): string {
  if (!code) return 'en';
  return code.replace(/_auto$/, '').trim();
}

/**
 * Speaks text using either Android device native TextToSpeech or Web SpeechSynthesis.
 * Returns a Promise that resolves when speech finishes.
 */
export function speakText(
  text: string,
  lang: string = 'en',
  rate: number = 1.0,
  voiceName?: string,
  onBoundary?: (charIndex: number) => void
): Promise<void> {
  const cleanLang = normalizeLanguageCode(lang);
  const cleanRate = Math.max(0.2, Math.min(3.0, rate || 1.0));
  stopTTS();

  activeBoundaryCallback = onBoundary || null;

  // 1. Android Native TTS Bridge
  if (isAndroidNativeTTS() && window.AndroidNativeShell?.speak) {
    return new Promise((resolve, reject) => {
      try {
        const utteranceId = `native_tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        currentNativeUtteranceId = utteranceId;
        nativeTTSResolvers.set(utteranceId, { resolve, reject });

        // Start simulated boundary if onBoundary provided
        if (onBoundary) {
          startSimulatedBoundaryProgression(text, cleanRate, onBoundary);
        }

        const success = window.AndroidNativeShell!.speak(text, cleanLang, cleanRate, utteranceId);
        if (!success) {
          nativeTTSResolvers.delete(utteranceId);
          currentNativeUtteranceId = null;
          // Fall back to web speech if native fails
          fallbackWebSpeech(text, cleanLang, cleanRate, voiceName, onBoundary)
            .then(resolve)
            .catch(reject);
        }
      } catch (err) {
        // Fallback to web speech
        fallbackWebSpeech(text, cleanLang, cleanRate, voiceName, onBoundary)
          .then(resolve)
          .catch(reject);
      }
    });
  }

  // 2. Web Speech Synthesis API
  return fallbackWebSpeech(text, cleanLang, cleanRate, voiceName, onBoundary);
}

function startSimulatedBoundaryProgression(
  text: string,
  rate: number,
  onBoundary: (charIndex: number) => void
): () => void {
  if (simulatedBoundaryTimer) {
    clearTimeout(simulatedBoundaryTimer);
    simulatedBoundaryTimer = null;
  }

  // Find all word starting offsets
  const wordOffsets: number[] = [];
  const regex = /(\s+|[^\s\w]+|\w+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const isWord = /\S/.test(match[0]) && !/^[.,!?;:"'()[\]{}<>]+$/.test(match[0]);
    if (isWord) {
      wordOffsets.push(match.index);
    }
  }

  if (wordOffsets.length === 0) return () => {};

  // Notify first word immediately
  onBoundary(wordOffsets[0]);

  let currentWordIdx = 0;
  // Estimate ~220 words per minute at 1.0x rate (approx 270ms per word)
  const baseMsPerWord = Math.max(150, Math.min(800, 270 / Math.max(0.4, rate)));

  const scheduleNext = () => {
    currentWordIdx++;
    if (currentWordIdx < wordOffsets.length) {
      onBoundary(wordOffsets[currentWordIdx]);
      simulatedBoundaryTimer = setTimeout(scheduleNext, baseMsPerWord);
    }
  };

  simulatedBoundaryTimer = setTimeout(scheduleNext, baseMsPerWord);

  return () => {
    if (simulatedBoundaryTimer) {
      clearTimeout(simulatedBoundaryTimer);
      simulatedBoundaryTimer = null;
    }
  };
}

function fallbackWebSpeech(
  text: string,
  cleanLang: string,
  rate: number,
  voiceName?: string,
  onBoundary?: (charIndex: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(); // Do not block if speech synthesis is unavailable
      return;
    }

    try {
      // Resume in case speech synthesis audio context was suspended
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = cleanLang;
      utterance.rate = rate;

      // Select voice: first check if a specific voice was requested by name or URI
      const voices = window.speechSynthesis.getVoices() || [];
      if (voiceName && voices.length > 0) {
        const found = voices.find(
          (v) => v.name === voiceName || v.voiceURI === voiceName
        );
        if (found) {
          utterance.voice = found;
        }
      }

      // If no specific voice matched, fallback to language best-match
      if (!utterance.voice && voices.length > 0) {
        const exact = voices.find((v) => v.lang.toLowerCase() === cleanLang.toLowerCase());
        const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(cleanLang.toLowerCase().split('-')[0]));
        if (exact) {
          utterance.voice = exact;
        } else if (prefix) {
          utterance.voice = prefix;
        }
      }

      let hasRealBoundary = false;
      let clearSimulated: (() => void) | null = null;

      if (onBoundary) {
        // Initial word boundary
        onBoundary(0);
        clearSimulated = startSimulatedBoundaryProgression(text, rate, (charIdx) => {
          if (!hasRealBoundary) {
            onBoundary(charIdx);
          }
        });

        utterance.onboundary = (event) => {
          hasRealBoundary = true;
          if (clearSimulated) clearSimulated();
          if (event.name === 'word' || !event.name) {
            onBoundary(event.charIndex);
          }
        };
      }

      // Safety timeout: estimate speaking duration so headless environments don't hang
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedMs = Math.min(12000, Math.max(800, (wordCount / (2.2 * Math.max(0.4, rate))) * 1000 + 800));
      let isResolved = false;

      const finish = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(safetyTimer);
          if (simulatedBoundaryTimer) {
            clearTimeout(simulatedBoundaryTimer);
            simulatedBoundaryTimer = null;
          }
          currentUtterance = null;
          activeBoundaryCallback = null;
          resolve();
        }
      };

      const safetyTimer = setTimeout(finish, estimatedMs);

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = () => {
        finish();
      };

      currentUtterance = utterance;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Stops any active TTS playback immediately
 */
export function stopTTS(): void {
  if (simulatedBoundaryTimer) {
    clearTimeout(simulatedBoundaryTimer);
    simulatedBoundaryTimer = null;
  }
  activeBoundaryCallback = null;

  if (typeof window !== 'undefined') {
    if (window.AndroidNativeShell?.stopSpeaking) {
      try {
        window.AndroidNativeShell.stopSpeaking();
      } catch {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
  currentUtterance = null;
  if (currentNativeUtteranceId) {
    const callbacks = nativeTTSResolvers.get(currentNativeUtteranceId);
    if (callbacks) callbacks.resolve();
    nativeTTSResolvers.delete(currentNativeUtteranceId);
    currentNativeUtteranceId = null;
  }
}

/**
 * Checks if speech is currently outputting
 */
export function isTTSSpeaking(): boolean {
  if (typeof window === 'undefined') return false;
  if (isAndroidNativeTTS() && window.AndroidNativeShell?.isSpeaking) {
    try {
      return !!window.AndroidNativeShell.isSpeaking();
    } catch {}
  }
  return !!window.speechSynthesis?.speaking || !!currentNativeUtteranceId;
}
