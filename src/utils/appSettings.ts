import { STORAGE_KEYS } from '../config/appConfig';

/**
 * App Settings Configuration and Local Persistence
 * Advanced features are turned OFF by default to prevent resource draining.
 * Subtitle fetching methods are configurable and enabled by default.
 */

export type SubtitlePosition = 'top' | 'above' | 'under' | 'bottom';

export interface AppSettings {
  // UI Display: Compact, lightweight view by default (Android UI Guidelines: no scrolling, minimal controls)
  compactView: boolean;
  showExpandedControls: boolean; // Allow user to show them by updating configuration
  showTeacherPanel: boolean;
  showLinkBar: boolean;

  // Key Buttons Display: By default always show the most important buttons (Requirement 1)
  alwaysShowKeyControls: boolean;

  // Subtitle Positioning: By default keep translated subs on top (Requirement 1)
  subtitlePosition: SubtitlePosition;
  showTranslatedOnTop: boolean;

  // General languages user wants to learn from as target for future translation
  learningLanguages: string[];

  // Auto-fetch target translation subtitles via tlang once after default subs loaded (Requirement 6)
  autoFetchTargetTranslationsWithTlang: boolean;

  // Advanced Features (OFF by default)
  enableDiagnosticDock: boolean;
  enableNetworkInspector: boolean;
  enableErrorInspector: boolean;
  enableBackgroundPrecache: boolean;

  // Subtitle Fetching Methods (all enabled by default in settings)
  methods: {
    nativeTimedTextInterception: boolean;
    directTimedTextTlang: boolean;
    serverSubtitleExtraction: boolean;
    googleFreeTranslationFallback: boolean;
    offlineLocalCache: boolean;
  };

  // Playback Order
  playOrder: 'video_then_tts' | 'tts_then_video';

  // Limits
  onDemandCount: number; // Limited to next X=4 subtitles (Step 4.4)
  maxRetries: number; // Max retry limit to X=2 (Step 2.3)
}

export const SUPPORTED_LANGUAGES_CATALOG: { code: string; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'zh-CN', name: 'Chinese Simplified (简体中文)' },
  { code: 'zh-TW', name: 'Chinese Traditional (繁體中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'he', name: 'Hebrew (עברית)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'no', name: 'Norwegian (Norsk)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'cs', name: 'Czech (Čeština)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'hu', name: 'Hungarian (Magyar)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' },
  { code: 'tl', name: 'Tagalog / Filipino' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'fa', name: 'Persian (فارسی)' },
  { code: 'bg', name: 'Bulgarian (Български)' },
  { code: 'hr', name: 'Croatian (Hrvatski)' },
  { code: 'sr', name: 'Serbian (Српски)' },
  { code: 'sk', name: 'Slovak (Slovenčina)' },
  { code: 'sl', name: 'Slovenian (Slovenščina)' },
  { code: 'lt', name: 'Lithuanian (Lietuvių)' },
  { code: 'lv', name: 'Latvian (Latviešu)' },
  { code: 'et', name: 'Estonian (Eesti)' },
  { code: 'ca', name: 'Catalan (Català)' },
  { code: 'eu', name: 'Basque (Euskara)' },
  { code: 'gl', name: 'Galician (Galego)' },
  { code: 'ga', name: 'Irish (Gaeilge)' },
  { code: 'cy', name: 'Welsh (Cymraeg)' },
  { code: 'is', name: 'Icelandic (Íslenska)' },
  { code: 'sw', name: 'Swahili (Kiswahili)' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'hy', name: 'Armenian (Հայերեն)' },
  { code: 'ka', name: 'Georgian (ქართული)' },
  { code: 'az', name: 'Azerbaijani (Azərbaycan)' },
  { code: 'kk', name: 'Kazakh (Қазақ)' },
  { code: 'uz', name: 'Uzbek (Oʻzbek)' },
  { code: 'mn', name: 'Mongolian (Монгол)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'my', name: 'Burmese (မြန်မာ)' },
  { code: 'km', name: 'Khmer (ខ្មែរ)' },
  { code: 'lo', name: 'Lao (ລາວ)' },
  { code: 'sq', name: 'Albanian (Shqip)' },
  { code: 'mk', name: 'Macedonian (Македонски)' },
  { code: 'bs', name: 'Bosnian (Bosanski)' },
  { code: 'mt', name: 'Maltese (Malti)' },
  { code: 'la', name: 'Latin (Latina)' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'yi', name: 'Yiddish (ייִדיש)' },
];

export const DEFAULT_APP_SETTINGS: AppSettings = {
  // Web Companion / Workspace Mode: Expanded controls enabled by default for interactive demo and E2E test suites; users can toggle compactView in settings
  compactView: false,
  showExpandedControls: true,
  showTeacherPanel: true,
  showLinkBar: true,

  // By default always show the most important buttons (Requirement 1)
  alwaysShowKeyControls: true,

  // By default keep translated subtitles on top, overlay inside top of video (Requirement 1)
  subtitlePosition: 'top',
  showTranslatedOnTop: true,

  // Favorite languages / learning targets by default: it, ru, he, en, ar
  learningLanguages: ['it', 'ru', 'he', 'en', 'ar'],

  // By default try to subtitle fetch using tlang param change once after default subs loaded (Requirement 6)
  autoFetchTargetTranslationsWithTlang: true,

  // Advanced features: OFF by default
  enableDiagnosticDock: false,
  enableNetworkInspector: false,
  enableErrorInspector: false,
  enableBackgroundPrecache: false,

  // Subtitle methods: all available
  methods: {
    nativeTimedTextInterception: true,
    directTimedTextTlang: true,
    serverSubtitleExtraction: true,
    googleFreeTranslationFallback: true,
    offlineLocalCache: true,
  },

  playOrder: 'video_then_tts',
  onDemandCount: 4,
  maxRetries: 2,
};

const SETTINGS_STORAGE_KEY = STORAGE_KEYS.SETTINGS_STORAGE_KEY;

export function loadAppSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_APP_SETTINGS,
        ...parsed,
        methods: {
          ...DEFAULT_APP_SETTINGS.methods,
          ...(parsed.methods || {}),
        },
      };
    }
  } catch (err) {
    console.warn('[AppSettings] Failed to load stored settings:', err);
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('[AppSettings] Failed to save settings:', err);
  }
}

// ----------------------------------------------------------------------------
// Per-VideoID Settings Management (Target Languages, TTS Rates, Play Order)
// ----------------------------------------------------------------------------
export interface VideoSpecificSettings {
  targetLanguages?: any[];
  ttsRates?: Record<string, number>; // langCode -> rate
  playOrder?: 'video_first' | 'tts_first';
  sourceLang?: string;
  activeTargetLang?: string;
  lastUpdated?: number;
}

const VIDEO_SETTINGS_KEY_PREFIX = 'yt_video_settings_';

export function loadVideoSettings(videoId: string): VideoSpecificSettings | null {
  if (typeof window === 'undefined' || !videoId) return null;
  try {
    const raw = localStorage.getItem(`${VIDEO_SETTINGS_KEY_PREFIX}${videoId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`[AppSettings] Failed to load settings for video ${videoId}:`, err);
  }
  return null;
}

export function saveVideoSettings(
  videoId: string,
  settings: Partial<VideoSpecificSettings>
): void {
  if (typeof window === 'undefined' || !videoId) return;
  try {
    const existing = loadVideoSettings(videoId) || {};
    const updated: VideoSpecificSettings = {
      ...existing,
      ...settings,
      ttsRates: {
        ...(existing.ttsRates || {}),
        ...(settings.ttsRates || {}),
      },
      lastUpdated: Date.now(),
    };
    localStorage.setItem(
      `${VIDEO_SETTINGS_KEY_PREFIX}${videoId}`,
      JSON.stringify(updated)
    );
  } catch (err) {
    console.warn(`[AppSettings] Failed to save settings for video ${videoId}:`, err);
  }
}

export function getUserLearningLanguages(): string[] {
  const current = loadAppSettings();
  return current.learningLanguages && current.learningLanguages.length > 0
    ? current.learningLanguages
    : DEFAULT_APP_SETTINGS.learningLanguages;
}

export function setUserLearningLanguages(languages: string[]): void {
  const current = loadAppSettings();
  saveAppSettings({
    ...current,
    learningLanguages: languages,
  });
}

export function getVideoTargetLang(videoId: string): string | null {
  const settings = loadVideoSettings(videoId);
  return settings?.activeTargetLang || null;
}

export function setVideoTargetLang(videoId: string, langCode: string): void {
  saveVideoSettings(videoId, { activeTargetLang: langCode });
}


