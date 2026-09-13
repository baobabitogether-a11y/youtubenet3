// Unified TTS Engine supporting Android Native TextToSpeech, Web Speech Synthesis, and Neural Audio Stream Fallback
import { logTTS, logError, logWarn, logInfo } from '../utils/logBuffer';
import { store } from '../store/index';
import { addError } from '../store/errorsSlice';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentNativeUtteranceId: string | null = null;
let activeBoundaryCallback: ((charIndex: number) => void) | null = null;
let simulatedBoundaryTimer: NodeJS.Timeout | null = null;
let nativeTTSResolvers: Map<string, { resolve: () => void; reject: (err: any) => void }> = new Map();

// Helper to report errors to both logBuffer and Redux errorsSlice
function reportTTSError(message: string, details?: any) {
  logError('TTS', message, details);
  try {
    store.dispatch(
      addError({
        section: 'system',
        title: 'TTS Playback Error',
        message: `TTS Error: ${message}`,
        details,
        stack: details?.error?.stack || (typeof details === 'string' ? details : JSON.stringify(details)),
      })
    );
  } catch {}
}

// Initialize native TTS callbacks on window once
if (typeof window !== 'undefined') {
  window.onNativeTTSDone = (utteranceId: string) => {
    logTTS(`[Native TTS] Completed utterance: ${utteranceId}`);
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
    reportTTSError(`Native TTS error (${utteranceId}): ${err}`);
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

export function getTTSEngineType(): 'android_native' | 'web_speech' | 'audio_stream' {
  if (isAndroidNativeTTS()) return 'android_native';
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) return 'web_speech';
  return 'audio_stream';
}

export function isTTSAvailable(): boolean {
  return true; // Supported across native, web speech, and audio stream fallback
}

/**
 * Detects language from unicode script if lang is ambiguous or default 'en'
 */
export function detectLanguageFromText(text: string): string {
  if (!text) return 'en';
  // Cyrillic (Russian, Ukrainian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Hebrew
  if (/[\u0590-\u05FF]/.test(text)) return 'he';
  // Japanese Kana / Kanji
  if (/[\u3040-\u30FF\u31F0-\u31FF]/.test(text)) return 'ja';
  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  // Korean Hangul
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko';
  // Greek
  if (/[\u0370-\u03FF]/.test(text)) return 'el';
  // Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
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
 * Speaks text using Android device native TextToSpeech, Web SpeechSynthesis,
 * or Neural Audio Stream fallback.
 * Returns a Promise that resolves when speech finishes.
 */
export async function speakText(
  text: string,
  lang: string = 'en',
  rate: number = 1.0,
  voiceName?: string,
  onBoundary?: (charIndex: number) => void
): Promise<void> {
  if (!text || !text.trim()) return;

  let cleanLang = normalizeLanguageCode(lang);
  // Auto-detect script if lang is 'en' or 'auto' but text contains non-Latin scripts
  if ((cleanLang === 'en' || cleanLang === 'auto') && text) {
    const detected = detectLanguageFromText(text);
    if (detected !== 'en') {
      cleanLang = detected;
    }
  }

  const cleanRate = Math.max(0.2, Math.min(3.0, rate || 1.0));
  stopTTS();

  logTTS(`Speech requested: "${text.substring(0, 45)}..." [lang: ${cleanLang}, rate: ${cleanRate}x, engine: ${getTTSEngineType()}]`);
  activeBoundaryCallback = onBoundary || null;

  // 1. Android Native TTS Bridge
  if (isAndroidNativeTTS() && window.AndroidNativeShell?.speak) {
    return new Promise((resolve, reject) => {
      try {
        const utteranceId = `native_tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        currentNativeUtteranceId = utteranceId;
        nativeTTSResolvers.set(utteranceId, { resolve, reject });

        if (onBoundary) {
          startSimulatedBoundaryProgression(text, cleanRate, onBoundary);
        }

        const success = window.AndroidNativeShell!.speak(text, cleanLang, cleanRate, utteranceId);
        if (!success) {
          logWarn('TTS', 'Native TTS speak call returned false, falling back to Web Speech / Audio');
          nativeTTSResolvers.delete(utteranceId);
          currentNativeUtteranceId = null;
          fallbackWebOrAudio(text, cleanLang, cleanRate, voiceName, onBoundary)
            .then(resolve)
            .catch(reject);
        }
      } catch (err) {
        logWarn('TTS', `Native TTS error, falling back: ${err}`);
        fallbackWebOrAudio(text, cleanLang, cleanRate, voiceName, onBoundary)
          .then(resolve)
          .catch(reject);
      }
    });
  }

  // 2. Web Speech API with automatic Audio Stream fallback
  return fallbackWebOrAudio(text, cleanLang, cleanRate, voiceName, onBoundary);
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

/**
 * Executes Web Speech synthesis or seamlessly cascades to neural Audio Stream
 */
async function fallbackWebOrAudio(
  text: string,
  cleanLang: string,
  rate: number,
  voiceName?: string,
  onBoundary?: (charIndex: number) => void
): Promise<void> {
  // If Web Speech is available, attempt synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      const hasMatchingVoice = voices.some((v) => {
        const langLower = v.lang.toLowerCase();
        const cleanLower = cleanLang.toLowerCase();
        return langLower === cleanLower || langLower.startsWith(cleanLower.split('-')[0]);
      });

      // If voices are already loaded and none match a non-English language, jump directly to audio stream
      if (voices.length > 0 && !hasMatchingVoice && cleanLang !== 'en') {
        logInfo('TTS', `No local Web Speech voice found for "${cleanLang}", using neural Audio Stream`);
        return speakViaAudioStream(text, cleanLang, rate, onBoundary);
      }

      const success = await attemptWebSpeechSynthesis(text, cleanLang, rate, voiceName, onBoundary);
      if (success) return;
    } catch (err: any) {
      logWarn('TTS', `Web SpeechSynthesis failed (${err?.message || err}), falling back to Audio Stream`);
    }
  }

  // Fallback to high-fidelity audio stream
  return speakViaAudioStream(text, cleanLang, rate, onBoundary);
}

function attemptWebSpeechSynthesis(
  text: string,
  cleanLang: string,
  rate: number,
  voiceName?: string,
  onBoundary?: (charIndex: number) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = cleanLang;
      utterance.rate = rate;

      // Pin utterance globally to prevent Chromium aggressive garbage-collection bug
      (window as any).__activeTTSUtterance = utterance;
      currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices() || [];
      if (voiceName && voices.length > 0) {
        const found = voices.find((v) => v.name === voiceName || v.voiceURI === voiceName);
        if (found) utterance.voice = found;
      }

      if (!utterance.voice && voices.length > 0) {
        const exact = voices.find((v) => v.lang.toLowerCase() === cleanLang.toLowerCase());
        const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(cleanLang.toLowerCase().split('-')[0]));
        if (exact) utterance.voice = exact;
        else if (prefix) utterance.voice = prefix;
      }

      let hasRealBoundary = false;
      let clearSimulated: (() => void) | null = null;

      if (onBoundary) {
        onBoundary(0);
        clearSimulated = startSimulatedBoundaryProgression(text, rate, (charIdx) => {
          if (!hasRealBoundary) onBoundary(charIdx);
        });

        utterance.onboundary = (event) => {
          hasRealBoundary = true;
          if (clearSimulated) clearSimulated();
          if (event.name === 'word' || !event.name) {
            onBoundary(event.charIndex);
          }
        };
      }

      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedMs = Math.min(15000, Math.max(1000, (wordCount / (2.2 * Math.max(0.4, rate))) * 1000 + 1000));
      let isSettled = false;

      const finishSuccess = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(safetyTimer);
          if (simulatedBoundaryTimer) {
            clearTimeout(simulatedBoundaryTimer);
            simulatedBoundaryTimer = null;
          }
          currentUtterance = null;
          (window as any).__activeTTSUtterance = null;
          logTTS(`[Web Speech] Completed speech for "${text.substring(0, 40)}..."`);
          resolve(true);
        }
      };

      const finishFailure = (reason: string) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(safetyTimer);
          if (simulatedBoundaryTimer) {
            clearTimeout(simulatedBoundaryTimer);
            simulatedBoundaryTimer = null;
          }
          currentUtterance = null;
          (window as any).__activeTTSUtterance = null;
          logWarn('TTS', `[Web Speech] Speech aborted (${reason}), will cascade to Audio Stream`);
          resolve(false);
        }
      };

      const safetyTimer = setTimeout(finishSuccess, estimatedMs);

      utterance.onend = () => {
        finishSuccess();
      };

      utterance.onerror = (event: any) => {
        const errType = event?.error || 'error';
        if (errType === 'canceled') {
          // Intentional stop
          if (!isSettled) {
            isSettled = true;
            clearTimeout(safetyTimer);
            resolve(true);
          }
        } else {
          finishFailure(errType);
        }
      };

      logTTS(`[Web Speech] Speaking "${text.substring(0, 40)}..." [lang: ${cleanLang}, voice: ${utterance.voice?.name || 'default'}]`);
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      reportTTSError(`Web speech synthesis threw exception: ${err?.message || err}`, { error: err });
      resolve(false);
    }
  });
}

/**
 * Plays speech through high-fidelity neural audio stream with full word boundary simulation
 */
function speakViaAudioStream(
  text: string,
  cleanLang: string,
  rate: number,
  onBoundary?: (charIndex: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    try {
      const primaryUrl = `/api/tts?text=${encodeURIComponent(text.substring(0, 500))}&lang=${encodeURIComponent(cleanLang)}`;
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 500))}&tl=${encodeURIComponent(cleanLang)}&client=tw-ob`;

      const audio = new Audio(primaryUrl);
      currentAudioElement = audio;
      audio.playbackRate = Math.max(0.5, Math.min(2.0, rate || 1.0));

      let clearBoundary: (() => void) | null = null;
      let isSettled = false;

      const finish = () => {
        if (!isSettled) {
          isSettled = true;
          if (clearBoundary) clearBoundary();
          if (simulatedBoundaryTimer) {
            clearTimeout(simulatedBoundaryTimer);
            simulatedBoundaryTimer = null;
          }
          if (currentAudioElement === audio) {
            currentAudioElement = null;
          }
          logTTS(`[Audio Stream] Completed playback for "${text.substring(0, 40)}..."`);
          resolve();
        }
      };

      audio.onplay = () => {
        logTTS(`[Audio Stream] Playing neural audio stream for "${text.substring(0, 40)}..." [lang: ${cleanLang}]`);
        if (onBoundary) {
          clearBoundary = startSimulatedBoundaryProgression(text, rate, onBoundary);
        }
      };

      audio.onended = () => {
        finish();
      };

      audio.onerror = () => {
        // If primary /api/tts endpoint fails, try direct upstream URL
        if (audio.src.includes('/api/tts')) {
          logWarn('TTS', '[Audio Stream] Primary /api/tts stream failed, switching to direct Google TTS URL');
          audio.src = fallbackUrl;
          audio.play().catch((playErr) => {
            reportTTSError(`Audio stream fallback playback failed: ${playErr?.message || playErr}`, { error: playErr });
            finish();
          });
        } else {
          reportTTSError('Audio stream playback failed on all endpoints');
          finish();
        }
      };

      audio.play().catch((playErr) => {
        reportTTSError(`Audio element play() rejected: ${playErr?.message || playErr}`, { error: playErr });
        finish();
      });
    } catch (err: any) {
      reportTTSError(`Failed to initialize audio stream: ${err?.message || err}`, { error: err });
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

  // Stop HTML5 Audio stream
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch {}
    currentAudioElement = null;
  }

  // Stop Android Native Shell
  if (typeof window !== 'undefined') {
    if (window.AndroidNativeShell?.stopSpeaking) {
      try {
        window.AndroidNativeShell.stopSpeaking();
      } catch {}
    }
    // Stop Web Speech
    if (window.speechSynthesis) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    }
  }

  currentUtterance = null;
  if (typeof window !== 'undefined') {
    (window as any).__activeTTSUtterance = null;
  }

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
  if (currentAudioElement && !currentAudioElement.paused) return true;
  if (isAndroidNativeTTS() && window.AndroidNativeShell?.isSpeaking) {
    try {
      return !!window.AndroidNativeShell.isSpeaking();
    } catch {}
  }
  return !!window.speechSynthesis?.speaking || !!currentNativeUtteranceId;
}

