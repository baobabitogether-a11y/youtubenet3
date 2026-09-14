// Unified TTS Engine supporting Android Native TextToSpeech, Web Speech Synthesis, and Neural Audio Stream Fallback
import { logTTS, logError, logWarn, logInfo } from '../utils/logBuffer';
import { store } from '../store/index';
import { addError } from '../store/errorsSlice';
import { recordRequestStart, recordRequestComplete, recordRequestFailed } from '../store/networkSlice';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentNativeUtteranceId: string | null = null;
let activeBoundaryCallback: ((charIndex: number) => void) | null = null;
let simulatedBoundaryTimer: NodeJS.Timeout | null = null;
let nativeTTSResolvers: Map<string, { resolve: () => void; reject: (err: any) => void }> = new Map();

/**
 * Unlocks browser audio playback and speech synthesis on user interaction.
 * Call this upon any click, tap, or play button interaction.
 */
export function unlockTTSAudio(): void {
  if (typeof window === 'undefined') return;
  // 1. Resume Web Speech if paused or suspended
  if (window.speechSynthesis && window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.resume();
    } catch {}
  }
  // 2. Resume browser AudioContext
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!(window as any).__unlockedAudioCtx) {
        (window as any).__unlockedAudioCtx = new AudioCtx();
      }
      if ((window as any).__unlockedAudioCtx.state === 'suspended') {
        (window as any).__unlockedAudioCtx.resume().catch(() => {});
      }
    }
  } catch {}
}

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
    const rawVoices = window.speechSynthesis.getVoices() || [];
    const seen = new Set<string>();
    const voices = rawVoices.filter((v) => {
      const key = `${v.voiceURI || v.name}::${v.lang}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

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
  unlockTTSAudio();

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

interface WordTimingInfo {
  start: number;
  end: number;
  text: string;
  weight: number;
}

function extractWordTimings(text: string): WordTimingInfo[] {
  const result: WordTimingInfo[] = [];
  const regex = /(\s+|[^\s\p{L}\p{N}]+|[\p{L}\p{N}]+)/gu;
  let match: RegExpExecArray | null;
  const rawTokens: { text: string; start: number; end: number; isWord: boolean }[] = [];

  while ((match = regex.exec(text)) !== null) {
    const matchText = match[0];
    const start = match.index;
    const end = start + matchText.length;
    const isWord = /\S/.test(matchText) && !/^[.,!?;:"'()[\]{}<>«»„“—–]+$/.test(matchText);
    rawTokens.push({ text: matchText, start, end, isWord });
  }

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    if (token.isWord) {
      // Base weight: 100ms base + 35ms per character
      let weight = 100 + token.text.length * 35;
      // Check trailing punctuation for natural pause
      const nextToken = rawTokens[i + 1];
      if (nextToken && !nextToken.isWord) {
        if (/[,;—–-]/.test(nextToken.text)) {
          weight += 160;
        } else if (/[.!?:\n]/.test(nextToken.text)) {
          weight += 280;
        }
      }
      result.push({
        start: token.start,
        end: token.end,
        text: token.text,
        weight,
      });
    }
  }

  return result;
}

function startSimulatedBoundaryProgression(
  text: string,
  rate: number,
  onBoundary: (charIndex: number) => void,
  totalDurationMs?: number
): () => void {
  if (simulatedBoundaryTimer) {
    clearTimeout(simulatedBoundaryTimer);
    simulatedBoundaryTimer = null;
  }

  const words = extractWordTimings(text);
  if (words.length === 0) return () => {};

  // Notify first word immediately
  onBoundary(words[0].start);

  const cleanRate = Math.max(0.4, rate || 1.0);
  let intervals: number[] = [];

  if (totalDurationMs && totalDurationMs > 0) {
    const totalWeight = words.reduce((acc, w) => acc + w.weight, 0);
    intervals = words.map((w) => Math.max(80, (w.weight / totalWeight) * totalDurationMs));
  } else {
    intervals = words.map((w) => Math.max(80, Math.min(1200, w.weight / cleanRate)));
  }

  let currentWordIdx = 0;
  let isCancelled = false;

  const scheduleNext = () => {
    if (isCancelled) return;
    currentWordIdx++;
    if (currentWordIdx < words.length) {
      onBoundary(words[currentWordIdx].start);
      const nextDelay = intervals[currentWordIdx] || 250;
      simulatedBoundaryTimer = setTimeout(scheduleNext, nextDelay);
    }
  };

  const initialDelay = intervals[0] || 250;
  simulatedBoundaryTimer = setTimeout(scheduleNext, initialDelay);

  return () => {
    isCancelled = true;
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
          if ((event.name === 'word' || !event.name) && typeof event.charIndex === 'number') {
            if (event.charIndex > 0) {
              hasRealBoundary = true;
              if (clearSimulated) clearSimulated();
            }
            onBoundary(event.charIndex);
          }
        };
      }

      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedMs = Math.min(15000, Math.max(1000, (wordCount / (2.2 * Math.max(0.4, rate))) * 1000 + 1000));
      let isSettled = false;
      let hasStarted = false;

      const finishSuccess = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(startCheckTimer);
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
          clearTimeout(startCheckTimer);
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

      // Fast-fail detection: If synthesis hasn't fired onstart within 600ms, immediately failover to Audio Stream
      const startCheckTimer = setTimeout(() => {
        if (!hasStarted && !isSettled) {
          try {
            window.speechSynthesis.cancel();
          } catch {}
          finishFailure('did_not_start_within_600ms');
        }
      }, 600);

      const safetyTimer = setTimeout(() => {
        if (!hasStarted) {
          finishFailure('timeout_before_start');
        } else {
          finishSuccess();
        }
      }, estimatedMs);

      utterance.onstart = () => {
        hasStarted = true;
        clearTimeout(startCheckTimer);
        logTTS(`[Web Speech] Speech output started for "${text.substring(0, 40)}..."`);
      };

      utterance.onend = () => {
        finishSuccess();
      };

      utterance.onerror = (event: any) => {
        const errType = event?.error || 'error';
        if (errType === 'canceled') {
          // Intentional stop
          if (!isSettled) {
            isSettled = true;
            clearTimeout(startCheckTimer);
            clearTimeout(safetyTimer);
            resolve(true);
          }
        } else {
          finishFailure(errType);
        }
      };

      logTTS(`[Web Speech] Speaking "${text.substring(0, 40)}..." [lang: ${cleanLang}, voice: ${utterance.voice?.name || 'default'}]`);
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
      } catch {}
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

      const reqId = `tts-net-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const startTime = Date.now();
      try {
        store.dispatch(
          recordRequestStart({
            id: reqId,
            url: primaryUrl,
            method: 'GET',
            type: 'translation_api',
          })
        );
      } catch {}

      const audio = new Audio(primaryUrl);
      currentAudioElement = audio;
      audio.playbackRate = Math.max(0.5, Math.min(2.0, rate || 1.0));

      let clearBoundary: (() => void) | null = null;
      let isSettled = false;

      const finish = (success = true, errMsg?: string) => {
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
          try {
            if (success) {
              store.dispatch(
                recordRequestComplete({
                  id: reqId,
                  status: 200,
                  statusText: 'OK',
                  duration: Date.now() - startTime,
                  responseBody: `Audio stream completed for "${text.substring(0, 30)}..."`,
                })
              );
              logTTS(`[Audio Stream] Completed playback for "${text.substring(0, 40)}..."`);
            } else {
              store.dispatch(
                recordRequestFailed({
                  id: reqId,
                  error: errMsg || 'Audio playback failed',
                  duration: Date.now() - startTime,
                })
              );
            }
          } catch {}
          resolve();
        }
      };

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && onBoundary) {
          if (clearBoundary) clearBoundary();
          const totalDurationMs = (audio.duration * 1000) / audio.playbackRate;
          clearBoundary = startSimulatedBoundaryProgression(text, rate, onBoundary, totalDurationMs);
        }
      };

      audio.onplay = () => {
        logTTS(`[Audio Stream] Playing neural audio stream for "${text.substring(0, 40)}..." [lang: ${cleanLang}]`);
        if (onBoundary) {
          const totalDurationMs = audio.duration && !isNaN(audio.duration) && audio.duration > 0
            ? (audio.duration * 1000) / audio.playbackRate
            : undefined;
          clearBoundary = startSimulatedBoundaryProgression(text, rate, onBoundary, totalDurationMs);
        }
      };

      // Continuous timeupdate sync: matches current audio playback time to exact word offsets
      const words = extractWordTimings(text);
      if (words.length > 0 && onBoundary) {
        audio.ontimeupdate = () => {
          if (!audio.duration || isNaN(audio.duration) || audio.duration <= 0) return;
          const totalWeight = words.reduce((acc, w) => acc + w.weight, 0);
          const currentTimeMs = (audio.currentTime * 1000) / audio.playbackRate;
          const totalDurationMs = (audio.duration * 1000) / audio.playbackRate;

          let accumulatedMs = 0;
          for (let i = 0; i < words.length; i++) {
            const wordMs = Math.max(80, (words[i].weight / totalWeight) * totalDurationMs);
            if (currentTimeMs >= accumulatedMs && currentTimeMs < accumulatedMs + wordMs) {
              onBoundary(words[i].start);
              break;
            }
            accumulatedMs += wordMs;
          }
        };
      }

      audio.onended = () => {
        finish(true);
      };

      audio.onerror = () => {
        // If primary /api/tts endpoint fails, try direct upstream URL
        if (audio.src.includes('/api/tts')) {
          logWarn('TTS', '[Audio Stream] Primary /api/tts stream failed, switching to direct Google TTS URL');
          audio.src = fallbackUrl;
          audio.play().catch((playErr) => {
            reportTTSError(`Audio stream fallback playback failed: ${playErr?.message || playErr}`, { error: playErr });
            finish(false, String(playErr));
          });
        } else {
          reportTTSError('Audio stream playback failed on all endpoints');
          finish(false, 'Audio stream failed on all endpoints');
        }
      };

      audio.play().catch((playErr) => {
        logWarn('TTS', `[Audio Stream] play() rejected (${playErr?.message || playErr}); running visual word-boundary progression`);
        unlockTTSAudio();
        if (onBoundary) {
          clearBoundary = startSimulatedBoundaryProgression(text, rate, onBoundary);
        }
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const estDurationMs = Math.min(8000, Math.max(1000, (wordCount / (2.2 * Math.max(0.5, rate))) * 1000));
        setTimeout(() => {
          finish(true);
        }, estDurationMs);
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

