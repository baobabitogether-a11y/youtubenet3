// Universal loader for authentic .srt fixtures across Vite client and Node/esbuild environments
import fs from 'fs';
import path from 'path';

// Vite client raw loader
const globFiles = (typeof import.meta !== 'undefined' && import.meta.glob
  ? import.meta.glob('./*.srt', { query: '?raw', eager: true, import: 'default' })
  : {}) as Record<string, string>;

const viteSrtFiles: Record<string, string> = {};
for (const [key, value] of Object.entries(globFiles)) {
  if (typeof value === 'string' && value.length > 0) {
    const cleanKey = key.replace(/^\.\//, '').replace(/\.srt$/i, '').toLowerCase();
    viteSrtFiles[cleanKey] = value;
    viteSrtFiles[key] = value;
    const langMatch = key.match(/([a-z]{2,3})\.srt$/i);
    if (langMatch) {
      viteSrtFiles[langMatch[1].toLowerCase()] = value;
    }
  }
}

function readSrtFromDisk(langCode: string): string {
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const candidatePaths = [
        path.join(process.cwd(), 'test/fixtures/languages', `${langCode}.srt`),
        path.join(__dirname, `${langCode}.srt`),
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          return fs.readFileSync(p, 'utf-8');
        }
      }
    }
  } catch {}
  return '';
}

export const arSrtRaw: string = viteSrtFiles['ar'] || viteSrtFiles['./ar.srt'] || readSrtFromDisk('ar');
export const enSrtRaw: string = viteSrtFiles['en'] || viteSrtFiles['./en.srt'] || readSrtFromDisk('en');
export const heSrtRaw: string = viteSrtFiles['he'] || viteSrtFiles['./he.srt'] || readSrtFromDisk('he');
export const itSrtRaw: string = viteSrtFiles['it'] || viteSrtFiles['./it.srt'] || readSrtFromDisk('it');
export const ruSrtRaw: string = viteSrtFiles['ru'] || viteSrtFiles['./ru.srt'] || readSrtFromDisk('ru');

/**
 * Default favorite languages: ar, il, ru, it, he
 * Note: 'il', 'he', and 'iw' all map to the Hebrew subtitle fixture.
 */
export const DEFAULT_FAVORITE_LANGUAGES: string[] = ['ar', 'il', 'ru', 'it', 'he'];

export const SRT_RAW_MAP: Record<string, string> = {
  ar: arSrtRaw,
  en: enSrtRaw,
  he: heSrtRaw,
  iw: heSrtRaw,
  il: heSrtRaw,
  it: itSrtRaw,
  ru: ruSrtRaw,
};




/**
 * Normalizes language codes (handling 'il', 'he', 'iw', region tags like 'ar-SA', 'he-IL').
 */
export function normalizeLanguageCode(langCode: string): string {
  const clean = (langCode || '').toLowerCase().trim().split(/[-_]/)[0];
  if (clean === 'il' || clean === 'iw') return 'he';
  return clean;
}

/**
 * Gets the raw SRT string content for a given language code.
 */
export function getRawSrtForLanguage(langCode: string): string | null {
  const clean = normalizeLanguageCode(langCode);
  return viteSrtFiles[clean] || SRT_RAW_MAP[clean] || SRT_RAW_MAP[langCode] || readSrtFromDisk(clean) || null;
}

/**
 * Checks if a language is in the favorite languages list and returns its authentic .srt content.
 * Specifically helps loading test/fixtures/languages/ar.srt if Arabic (ar) is included in favorite languages.
 */
export function loadSrtIfFavorite(
  langCode: string,
  favoriteLangs: string[] = DEFAULT_FAVORITE_LANGUAGES
): string | null {
  if (!langCode) return null;
  const clean = normalizeLanguageCode(langCode);
  const isFav = favoriteLangs.some((fav) => normalizeLanguageCode(fav) === clean);
  if (isFav) {
    return getRawSrtForLanguage(clean);
  }
  return null;
}

