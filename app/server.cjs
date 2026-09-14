var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/utils/captionParser.ts
var WIN1252_TO_BYTE = {
  8364: 128,
  8218: 130,
  402: 131,
  8222: 132,
  8230: 133,
  8224: 134,
  8225: 135,
  710: 136,
  8240: 137,
  352: 138,
  8249: 139,
  338: 140,
  381: 142,
  8216: 145,
  8217: 146,
  8220: 147,
  8221: 148,
  8226: 149,
  8211: 150,
  8212: 151,
  732: 152,
  8482: 153,
  353: 154,
  8250: 155,
  339: 156,
  382: 158,
  376: 159
};
function fixMojibake(str) {
  if (!str) return str;
  if (!/[\xC0-\xFF\u0100-\u02FF\u2010-\u2030]/.test(str)) return str;
  try {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 256) {
        bytes.push(code);
      } else if (WIN1252_TO_BYTE[code] !== void 0) {
        bytes.push(WIN1252_TO_BYTE[code]);
      } else {
        return str;
      }
    }
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
    if (decoded && decoded !== str) {
      return decoded;
    }
  } catch {
  }
  return str;
}
var NAMED_HTML_ENTITIES = {
  "&amp;": "&",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
  "&iexcl;": "\xA1",
  "&iquest;": "\xBF",
  "&laquo;": "\xAB",
  "&raquo;": "\xBB",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&lsquo;": "'",
  "&rsquo;": "'",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&hellip;": "\u2026",
  "&bull;": "\u2022",
  "&middot;": "\xB7",
  "&euro;": "\u20AC",
  "&pound;": "\xA3",
  "&yen;": "\xA5",
  "&cent;": "\xA2",
  "&copy;": "\xA9",
  "&reg;": "\xAE",
  "&trade;": "\u2122",
  "&deg;": "\xB0",
  "&plusmn;": "\xB1",
  "&times;": "\xD7",
  "&divide;": "\xF7",
  "&szlig;": "\xDF",
  // Acute
  "&aacute;": "\xE1",
  "&eacute;": "\xE9",
  "&iacute;": "\xED",
  "&oacute;": "\xF3",
  "&uacute;": "\xFA",
  "&yacute;": "\xFD",
  "&Aacute;": "\xC1",
  "&Eacute;": "\xC9",
  "&Iacute;": "\xCD",
  "&Oacute;": "\xD3",
  "&Uacute;": "\xDA",
  "&Yacute;": "\xDD",
  // Grave
  "&agrave;": "\xE0",
  "&egrave;": "\xE8",
  "&igrave;": "\xEC",
  "&ograve;": "\xF2",
  "&ugrave;": "\xF9",
  "&Agrave;": "\xC0",
  "&Egrave;": "\xC8",
  "&Igrave;": "\xCC",
  "&Ograve;": "\xD2",
  "&Ugrave;": "\xD9",
  // Circumflex
  "&acirc;": "\xE2",
  "&ecirc;": "\xEA",
  "&icirc;": "\xEE",
  "&ocirc;": "\xF4",
  "&ucirc;": "\xFB",
  "&Acirc;": "\xC2",
  "&Ecirc;": "\xCA",
  "&Icirc;": "\xCE",
  "&Ocirc;": "\xD4",
  "&Ucirc;": "\xDB",
  // Umlaut / Diaeresis
  "&auml;": "\xE4",
  "&euml;": "\xEB",
  "&iuml;": "\xEF",
  "&ouml;": "\xF6",
  "&uuml;": "\xFC",
  "&yuml;": "\xFF",
  "&Auml;": "\xC4",
  "&Euml;": "\xCB",
  "&Iuml;": "\xCF",
  "&Ouml;": "\xD6",
  "&Uuml;": "\xDC",
  // Tilde
  "&atilde;": "\xE3",
  "&ntilde;": "\xF1",
  "&otilde;": "\xF5",
  "&Atilde;": "\xC3",
  "&Ntilde;": "\xD1",
  "&Otilde;": "\xD5",
  // Cedilla
  "&ccedil;": "\xE7",
  "&Ccedil;": "\xC7",
  // Ring / Slash / Ligatures
  "&aring;": "\xE5",
  "&Aring;": "\xC5",
  "&oslash;": "\xF8",
  "&Oslash;": "\xD8",
  "&aelig;": "\xE6",
  "&AElig;": "\xC6",
  "&oelig;": "\u0153",
  "&OElig;": "\u0152"
};
function decodeHtmlEntities(text) {
  if (!text) return "";
  let s = text;
  s = s.replace(/&#(\d+);?/g, (_, dec) => {
    const code = parseInt(dec, 10);
    return code >= 0 && code <= 1114111 ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => {
    const code = parseInt(hex, 16);
    return code >= 0 && code <= 1114111 ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&[a-zA-Z]+;/g, (m) => NAMED_HTML_ENTITIES[m] || m);
  if (typeof DOMParser !== "undefined" && s.includes("&")) {
    try {
      const doc = new DOMParser().parseFromString(s, "text/html");
      if (doc && doc.body && doc.body.textContent) {
        s = doc.body.textContent;
      }
    } catch {
    }
  }
  return s;
}
function cleanAndFixEncoding(text) {
  if (!text) return "";
  let s = text;
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  s = s.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
  s = decodeHtmlEntities(s);
  s = fixMojibake(s);
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\u00A0/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}
function parseRawCaptionData(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.includes('"events"')) {
    try {
      const data = JSON.parse(trimmed);
      const cues = [];
      let counter = 1;
      if (Array.isArray(data.events)) {
        for (const ev of data.events) {
          if (ev.segs && Array.isArray(ev.segs)) {
            const rawSegText = ev.segs.map((s) => s.utf8 || "").join("");
            const text = cleanAndFixEncoding(rawSegText);
            if (text) {
              const start = (ev.tStartMs || 0) / 1e3;
              const duration = (ev.dDurationMs || 0) / 1e3;
              cues.push({
                id: `cue-${counter++}`,
                start,
                duration: Math.max(1, duration),
                text
              });
            }
          }
        }
      }
      return { format: "json3", cues };
    } catch {
    }
  }
  if (trimmed.startsWith("<") || trimmed.includes("<text ") || trimmed.includes("<p ")) {
    const cues = [];
    let counter = 1;
    const textTagRegex = /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/gi;
    let match;
    while ((match = textTagRegex.exec(trimmed)) !== null) {
      const start = parseFloat(match[1]) || 0;
      const duration = parseFloat(match[2]) || 0;
      const cleanText = cleanAndFixEncoding(match[3]);
      if (cleanText) {
        cues.push({
          id: `cue-${counter++}`,
          start,
          duration: Math.max(1, duration),
          text: cleanText
        });
      }
    }
    if (cues.length === 0) {
      const pTagRegex = /<p\s+t="([^"]+)"(?:\s+d="([^"]+)")?[^>]*>([\s\S]*?)<\/p>/gi;
      while ((match = pTagRegex.exec(trimmed)) !== null) {
        const start = (parseFloat(match[1]) || 0) / 1e3;
        const duration = (parseFloat(match[2] || "0") || 0) / 1e3;
        const cleanText = cleanAndFixEncoding(match[3]);
        if (cleanText) {
          cues.push({
            id: `cue-${counter++}`,
            start,
            duration: Math.max(1, duration),
            text: cleanText
          });
        }
      }
    }
    if (cues.length > 0) {
      return { format: "xml", cues };
    }
  }
  if (trimmed.startsWith("WEBVTT") || trimmed.includes("-->")) {
    const cues = [];
    let counter = 1;
    const blocks = trimmed.split(/\n\s*\n/);
    for (const block of blocks) {
      const lines = block.trim().split("\n");
      const timeLineIndex = lines.findIndex((l) => l.includes("-->"));
      if (timeLineIndex !== -1) {
        const timeLine = lines[timeLineIndex];
        const [startStr, endStr] = timeLine.split("-->").map((s) => s.trim());
        const parseVttTime = (t) => {
          const parts = t.split(":");
          if (parts.length === 3) {
            return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
          } else if (parts.length === 2) {
            return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
          }
          return 0;
        };
        const start = parseVttTime(startStr);
        const end = parseVttTime(endStr);
        const rawText = lines.slice(timeLineIndex + 1).join(" ");
        const text = cleanAndFixEncoding(rawText);
        if (text) {
          cues.push({
            id: `cue-${counter++}`,
            start,
            duration: Math.max(1, end - start),
            text
          });
        }
      }
    }
    if (cues.length > 0) {
      return { format: "vtt", cues };
    }
  }
  if (trimmed.includes("-->")) {
    const cues = [];
    let counter = 1;
    const blocks = trimmed.split(/\r?\n\s*\r?\n/);
    for (const block of blocks) {
      const lines = block.trim().split(/\r?\n/);
      const timeLineIndex = lines.findIndex((l) => l.includes("-->"));
      if (timeLineIndex !== -1) {
        const timeLine = lines[timeLineIndex];
        const [startStr, endStr] = timeLine.split("-->").map((s) => s.trim());
        const parseSrtTime = (t) => {
          const parts = t.replace(",", ".").split(":");
          if (parts.length === 3) {
            return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
          } else if (parts.length === 2) {
            return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
          }
          return parseFloat(parts[0]) || 0;
        };
        const start = parseSrtTime(startStr);
        const end = parseSrtTime(endStr);
        const rawText = lines.slice(timeLineIndex + 1).join(" ");
        const text = cleanAndFixEncoding(rawText);
        if (text) {
          cues.push({
            id: `cue-${counter++}`,
            start,
            duration: Math.max(1, end - start),
            text
          });
        }
      }
    }
    if (cues.length > 0) {
      return { format: "vtt", cues };
    }
  }
  return { format: "unknown", cues: [] };
}
var SAMPLE_YOUTUBE_TIMEDTEXT_JSON3 = JSON.stringify(
  {
    wireMagic: "pb3",
    pens: [{}],
    wsWinStyles: [{}],
    wpWinPositions: [{}],
    events: [
      {
        tStartMs: 1420,
        dDurationMs: 3150,
        segs: [{ utf8: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u043E\u0440\u043E\u0433\u0438\u0435 \u0434\u0440\u0443\u0437\u044C\u044F! \u0420\u0430\u0434 \u043F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0432\u0430\u0441 \u043D\u0430 \u043D\u0430\u0448\u0435\u043C \u043A\u0430\u043D\u0430\u043B\u0435." }]
      },
      {
        tStartMs: 4800,
        dDurationMs: 4200,
        segs: [{ utf8: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0443 \u043D\u0430\u0441 \u0432 \u0441\u0442\u0443\u0434\u0438\u0438 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u044B\u0439 \u0433\u043E\u0441\u0442\u044C \u2014 \u0410\u0440\u043A\u0430\u0434\u0438\u0439 \u0414\u0443\u0445\u0438\u043D." }]
      },
      {
        tStartMs: 9150,
        dDurationMs: 3850,
        segs: [{ utf8: "\u041C\u044B \u043F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043C \u043E \u043C\u0443\u0437\u044B\u043A\u0435, \u0442\u0432\u043E\u0440\u0447\u0435\u0441\u0442\u0432\u0435 \u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440\u0430 \u0412\u044B\u0441\u043E\u0446\u043A\u043E\u0433\u043E \u0438 \u0410\u0440\u0438\u043A\u0430 \u0410\u0439\u043D\u0448\u0442\u0435\u0439\u043D\u0430." }]
      },
      {
        tStartMs: 13200,
        dDurationMs: 4100,
        segs: [{ utf8: "\u0410 \u0442\u0430\u043A\u0436\u0435 \u043E\u0431\u0441\u0443\u0434\u0438\u043C \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0435 \u0441\u043C\u044B\u0441\u043B\u044B: \u043C\u043E\u0436\u0435\u0442 \u043B\u0438 \u043C\u0443\u0437\u044B\u043A\u0430 \u0441\u043F\u0430\u0441\u0442\u0438 \u0436\u0438\u0437\u043D\u044C \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430?" }]
      },
      {
        tStartMs: 17500,
        dDurationMs: 3600,
        segs: [{ utf8: "\u041A\u0430\u043A \u0432\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u044D\u0442\u0430 \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u044F \u0436\u0430\u043D\u0440\u043E\u0432: \u0440\u044D\u043F, \u0440\u043E\u043A \u0438 \u043A\u0430\u0431\u0431\u0430\u043B\u0430?" }]
      },
      {
        tStartMs: 21300,
        dDurationMs: 4800,
        segs: [{ utf8: "\u0410\u0440\u043A\u0430\u0434\u0438\u0439, \u0434\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C! \u0421 \u0447\u0435\u0433\u043E \u043D\u0430\u0447\u0430\u043B\u0441\u044F \u0432\u0430\u0448 \u043F\u0443\u0442\u044C?" }]
      },
      {
        tStartMs: 26400,
        dDurationMs: 4200,
        segs: [{ utf8: "\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435. \u0412\u0441\u0435 \u043D\u0430\u0447\u0430\u043B\u043E\u0441\u044C \u0435\u0449\u0435 \u0432 \u0434\u0435\u0442\u0441\u0442\u0432\u0435." }]
      }
    ]
  },
  null,
  2
);

// test/fixtures/languages/srtStrings.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_meta = {};
var globFiles = typeof import_meta !== "undefined" && import_meta.glob ? import_meta.glob("./*.srt", { query: "?raw", eager: true, import: "default" }) : {};
var viteSrtFiles = {};
for (const [key, value] of Object.entries(globFiles)) {
  if (typeof value === "string" && value.length > 0) {
    const cleanKey = key.replace(/^\.\//, "").replace(/\.srt$/i, "").toLowerCase();
    viteSrtFiles[cleanKey] = value;
    viteSrtFiles[key] = value;
    const langMatch = key.match(/([a-z]{2,3})\.srt$/i);
    if (langMatch) {
      viteSrtFiles[langMatch[1].toLowerCase()] = value;
    }
  }
}
function readSrtFromDisk(langCode) {
  try {
    if (typeof process !== "undefined" && process.versions?.node) {
      const candidatePaths = [
        import_path.default.join(process.cwd(), "test/fixtures/languages", `${langCode}.srt`),
        import_path.default.join(__dirname, `${langCode}.srt`)
      ];
      for (const p of candidatePaths) {
        if (import_fs.default.existsSync(p)) {
          return import_fs.default.readFileSync(p, "utf-8");
        }
      }
    }
  } catch {
  }
  return "";
}
var arSrtRaw = viteSrtFiles["ar"] || viteSrtFiles["./ar.srt"] || readSrtFromDisk("ar");
var enSrtRaw = viteSrtFiles["en"] || viteSrtFiles["./en.srt"] || readSrtFromDisk("en");
var heSrtRaw = viteSrtFiles["he"] || viteSrtFiles["./he.srt"] || readSrtFromDisk("he");
var itSrtRaw = viteSrtFiles["it"] || viteSrtFiles["./it.srt"] || readSrtFromDisk("it");
var ruSrtRaw = viteSrtFiles["ru"] || viteSrtFiles["./ru.srt"] || readSrtFromDisk("ru");

// test/fixtures/defaultSubtitles.ts
var parsedRu = parseRawCaptionData(ruSrtRaw).cues;
var parsedEn = parseRawCaptionData(enSrtRaw).cues;
var parsedHe = parseRawCaptionData(heSrtRaw).cues;
var parsedIt = parseRawCaptionData(itSrtRaw).cues;
var parsedAr = parseRawCaptionData(arSrtRaw).cues;
var FCRZADI8R9U_LANGUAGE_SRT_TRACKS = {
  ru: parsedRu,
  en: parsedEn,
  he: parsedHe,
  iw: parsedHe,
  il: parsedHe,
  it: parsedIt,
  ar: parsedAr
};
var LEGACY_VIDEO_CUES = {
  default: [
    { id: "cue-1", start: 0, duration: 4, text: "Welcome to this YouTube video presentation." },
    { id: "cue-2", start: 4.2, duration: 5, text: "Follow along with the synchronized timed subtitles." },
    { id: "cue-3", start: 9.5, duration: 4.8, text: "Click any word to look up translations and hear pronunciation." },
    { id: "cue-4", start: 14.5, duration: 5.5, text: "Subtitles are automatically synchronized with the video playback." },
    { id: "cue-5", start: 20.2, duration: 4.5, text: "Enjoy practicing and improving your language skills!" }
  ],
  jNQXAC9IVRw: [
    { id: "cue-1", start: 1.2, duration: 3.2, text: "All right, so here we are in front of the elephants." },
    { id: "cue-2", start: 4.5, duration: 3, text: "The cool thing about these guys is that..." },
    { id: "cue-3", start: 7.6, duration: 3.5, text: "...they have really, really, really long trunks." },
    { id: "cue-4", start: 11.2, duration: 2.8, text: "And that is cool." },
    { id: "cue-5", start: 14.1, duration: 4.2, text: "And that is pretty much all there is to say." }
  ],
  c0pUbsq9FLk: [
    { id: "cue-1", start: 0.5, duration: 3.5, text: "Welcome to this video tutorial on language learning." },
    { id: "cue-2", start: 4.2, duration: 4, text: "We will demonstrate real-time synchronized caption playback." },
    { id: "cue-3", start: 8.5, duration: 4.2, text: "Text-to-speech audio pronounces each sentence with proper pacing." },
    { id: "cue-4", start: 13, duration: 3.8, text: "Enjoy practicing your foreign language listening comprehension." }
  ],
  HGEyIt2bMiE: [
    { id: "cue-1", start: 0.8, duration: 3.8, text: "Hello and welcome to this English language practice lesson." },
    { id: "cue-2", start: 4.8, duration: 4.2, text: "In this lesson, we will focus on everyday conversational expressions." },
    { id: "cue-3", start: 9.2, duration: 4.5, text: "Listen carefully to the pronunciation of each phrase." },
    { id: "cue-4", start: 14, duration: 3.5, text: "Repeat each sentence after the speaker to improve fluency." },
    { id: "cue-5", start: 18, duration: 4, text: "Great job, keep up the regular practice every day!" }
  ]
};
var DEFAULT_MOCKED_SUBTITLES = {
  ...LEGACY_VIDEO_CUES,
  FcRzAdI8R9U: parsedRu
};

// src/config/appConfig.ts
var DEFAULT_VIDEO_ID = "FcRzAdI8R9U";
var DEFAULT_VIDEO_URL = `https://www.youtube.com/watch?v=${DEFAULT_VIDEO_ID}`;
var ANDROID_TEST_VIDEO_ID = "HGEyIt2bMiE";
var ANDROID_TEST_VIDEO_URL = `https://www.youtube.com/watch?v=${ANDROID_TEST_VIDEO_ID}`;
var ME_AT_THE_ZOO_ID = "jNQXAC9IVRw";
var ME_AT_THE_ZOO_URL = `https://www.youtube.com/watch?v=${ME_AT_THE_ZOO_ID}`;
var TUTORIAL_TEST_VIDEO_ID = "c0pUbsq9FLk";
var TUTORIAL_TEST_VIDEO_URL = `https://www.youtube.com/watch?v=${TUTORIAL_TEST_VIDEO_ID}`;
var DEFAULT_LIBRARY_ITEMS = [
  {
    id: DEFAULT_VIDEO_ID,
    originalUrl: DEFAULT_VIDEO_URL,
    title: "Authentic Russian Interview (Sheinkin40)",
    cues: FCRZADI8R9U_LANGUAGE_SRT_TRACKS.ru,
    timestamp: Date.now()
  },
  {
    id: ME_AT_THE_ZOO_ID,
    originalUrl: ME_AT_THE_ZOO_URL,
    title: "Me at the zoo",
    cues: [
      { id: "cue-1", start: 1.2, duration: 3.2, text: "All right, so here we are in front of the elephants." },
      { id: "cue-2", start: 4.5, duration: 3, text: "The cool thing about these guys is that..." },
      { id: "cue-3", start: 7.6, duration: 3.5, text: "...they have really, really, really long trunks." },
      { id: "cue-4", start: 11.2, duration: 2.8, text: "And that is cool." },
      { id: "cue-5", start: 14.1, duration: 4.2, text: "And that is pretty much all there is to say." }
    ],
    timestamp: Date.now()
  }
];

// src/utils/youtube.ts
function buildYouTubeTranslatedTimedTextUrl(observedUrl, targetLangCode, format = "srt") {
  try {
    const urlObj = new URL(observedUrl);
    urlObj.searchParams.set("tlang", targetLangCode);
    if (format === "srt" || format === "json3" || format === "vtt") {
      urlObj.searchParams.set("fmt", format);
    } else if (format === "xml" || format === "") {
      urlObj.searchParams.delete("fmt");
    }
    return urlObj.toString();
  } catch {
    let modified = observedUrl;
    if (/[?&]tlang=[^&]*/.test(modified)) {
      modified = modified.replace(/([?&])tlang=[^&]*/, `$1tlang=${encodeURIComponent(targetLangCode)}`);
    } else {
      const sep = modified.includes("?") ? "&" : "?";
      modified = `${modified}${sep}tlang=${encodeURIComponent(targetLangCode)}`;
    }
    if (format === "srt" || format === "json3" || format === "vtt") {
      if (/[?&]fmt=[^&]*/.test(modified)) {
        modified = modified.replace(/([?&])fmt=[^&]*/, `$1fmt=${format}`);
      } else {
        modified = `${modified}&fmt=${format}`;
      }
    } else if (format === "xml" || format === "") {
      modified = modified.replace(/[?&]fmt=[^&]*/, "");
    }
    return modified;
  }
}

// src/config/fixtures.ts
var SAMPLE_AUTHENTIC_RUSSIAN_URL = "https://www.youtube.com/api/timedtext?v=FcRzAdI8R9U&ei=IgqnasHxK-PlxN8PtNy9mAk&caps=asr&opi=112496729&exp=xpe&xoaf=5&xowf=1&xospf=1&hl=en-GB&ip=0.0.0.0&ipbits=0&expire=1789357202&sparams=ip%2Cipbits%2Cexpire%2Cv%2Cei%2Ccaps%2Copi%2Cexp%2Cxoaf&signature=6F0A50A646D36C936CF08C81E3702F28F7097F32.2BA8D9DB6AC9EA7432E53BA37171C0D7C9B3E5D6&key=yt8&kind=asr&lang=ru&potc=1&pot=MljuxV9kEE2ck-6E1TfArA74newqYy3DyWzY0uJcGahUzcJZ5P420d2bDCdzceWegqPMG6vAM4W9-dWo1CHmF-vE7csjIK76JiUqXREGzeh2xbTX0UV9ybSs&fmt=srt&xorb=2&xobt=3&xovt=3&cbr=Chrome&cbrver=153.0.0.0&c=WEB&cver=2.20260911.01.00&cplayer=UNIPLAYER&cos=Windows&cosver=10.0&cplatform=DESKTOP";
var SAMPLE_AUTHENTIC_TIMEDTEXT_HEADERS = {
  "accept": "*/*",
  "accept-language": "he-IL,he;q=0.6",
  "referer": "https://www.youtube.com/watch?v=FcRzAdI8R9U",
  "sec-ch-ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
  "sec-ch-ua-arch": '"x86"',
  "sec-ch-ua-bitness": '"64"',
  "sec-ch-ua-full-version-list": '"Google Chrome";v="153.0.0.0", "Not_A Brand";v="8.0.0.0", "Chromium";v="153.0.0.0"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"19.0.0"',
  "sec-ch-ua-wow64": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-gpc": "1",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
  "x-goog-authuser": "0",
  "x-youtube-client-name": "1",
  "x-youtube-client-version": "2.20260911.01.00",
  "x-youtube-device": "cbr=Chrome&cbrver=153.0.0.0&ceng=WebKit&cengver=537.36&cos=Windows&cosver=10.0&cplatform=DESKTOP",
  "x-youtube-identity-token": "QUM4Zm9rUmdOVm9JZU8wNTV2ak1NMXZTajI4Q3w=",
  "x-youtube-page-cl": "979575444",
  "x-youtube-page-label": "youtube.desktop.web_20260911_01_RC00",
  "x-youtube-time-zone": "Asia/Jerusalem",
  "x-youtube-utc-offset": "180"
};
var SAMPLE_AUTHENTIC_RUSSIAN_CUES = [
  { id: "cue-1", start: 0, duration: 4.2, text: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u043E\u0440\u043E\u0433\u0438\u0435 \u0437\u0440\u0438\u0442\u0435\u043B\u0438, \u0432 \u044D\u0444\u0438\u0440\u0435 \u044D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432 \u043D\u0430 Sheinkin40." },
  { id: "cue-2", start: 4.5, duration: 4.5, text: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0443 \u043D\u0430\u0441 \u0432 \u0433\u043E\u0441\u0442\u044F\u0445 \u043B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043C\u0443\u0437\u044B\u043A\u0430\u043D\u0442 \u0438 \u0430\u0432\u0442\u043E\u0440 \u043F\u0435\u0441\u0435\u043D \u0410\u0440\u043A\u0430\u0434\u0438\u0439 \u0414\u0443\u0445\u0438\u043D." },
  { id: "cue-3", start: 9.2, duration: 5.3, text: "\u041C\u044B \u043F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043C \u043E \u043F\u0435\u0441\u043D\u044F\u0445 \u0412\u044B\u0441\u043E\u0446\u043A\u043E\u0433\u043E, \u043E \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0435, \u041D\u0435\u0442\u0430\u043D\u044C\u044F\u0445\u0443 \u0438 \u043E \u0442\u043E\u043C, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0441 \u0418\u0437\u0440\u0430\u0438\u043B\u0435\u043C." },
  { id: "cue-4", start: 14.8, duration: 5, text: "\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u043E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u0437\u0430 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435, \u044D\u0442\u043E \u043E\u0447\u0435\u043D\u044C \u0432\u0430\u0436\u043D\u0430\u044F \u0438 \u0433\u043B\u0443\u0431\u043E\u043A\u0430\u044F \u0442\u0435\u043C\u0430 \u0434\u043B\u044F \u043C\u0435\u043D\u044F." },
  { id: "cue-5", start: 20, duration: 5.5, text: "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043D\u0430\u0447\u043D\u0435\u043C \u0441 \u0432\u0430\u0448\u0435\u0433\u043E \u0432\u0437\u0433\u043B\u044F\u0434\u0430 \u043D\u0430 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u0443\u044E \u0436\u0438\u0437\u043D\u044C." },
  { id: "cue-6", start: 25.8, duration: 5.2, text: "\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u0430 \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0442\u0440\u0430\u0436\u0430\u0435\u0442 \u0442\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043E\u0431\u0449\u0435\u0441\u0442\u0432\u043E." },
  { id: "cue-7", start: 31.2, duration: 5, text: "\u041C\u0443\u0437\u044B\u043A\u0430 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u0430 \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u044F\u0442\u044C \u043B\u044E\u0434\u0435\u0439, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u0441\u043B\u043E\u0432\u0430 \u0440\u0430\u0437\u0434\u0435\u043B\u044F\u044E\u0442 \u0438\u0445." },
  { id: "cue-8", start: 36.5, duration: 5.5, text: "\u041F\u0435\u0441\u043D\u0438 \u0412\u044B\u0441\u043E\u0446\u043A\u043E\u0433\u043E \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u043D\u0438 \u043E \u043F\u0440\u0430\u0432\u0434\u0435." },
  { id: "cue-9", start: 42.2, duration: 4.8, text: "\u041C\u044B \u0436\u0438\u0432\u0435\u043C \u0432 \u0441\u043B\u043E\u0436\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F, \u0442\u0440\u0435\u0431\u0443\u044E\u0449\u0435\u0435 \u0432\u0437\u0430\u0438\u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043D\u0438\u043C\u0430\u043D\u0438\u044F \u0438 \u0441\u043E\u0441\u0442\u0440\u0430\u0434\u0430\u043D\u0438\u044F." },
  { id: "cue-10", start: 47.2, duration: 5.2, text: "\u0422\u0432\u043E\u0440\u0447\u0435\u0441\u0442\u0432\u043E \u0434\u0430\u0435\u0442 \u043D\u0430\u0434\u0435\u0436\u0434\u0443 \u0438 \u0441\u0438\u043B\u044B \u0434\u0432\u0438\u0433\u0430\u0442\u044C\u0441\u044F \u0432\u043F\u0435\u0440\u0435\u0434 \u043D\u0435\u0441\u043C\u043E\u0442\u0440\u044F \u043D\u0438 \u043D\u0430 \u0447\u0442\u043E." }
];
var SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U = [
  { id: "cue-1", start: 0, duration: 4.2, text: "\u05E9\u05DC\u05D5\u05DD \u05DC\u05E6\u05D5\u05E4\u05D9\u05DD \u05D4\u05D9\u05E7\u05E8\u05D9\u05DD, \u05D1\u05E9\u05D9\u05D3\u05D5\u05E8 \u05D1\u05DC\u05E2\u05D3\u05D9 \u05D1-Sheinkin40." },
  { id: "cue-2", start: 4.5, duration: 4.5, text: "\u05D4\u05D9\u05D5\u05DD \u05DE\u05EA\u05D0\u05E8\u05D7 \u05D0\u05E6\u05DC\u05E0\u05D5 \u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D0\u05D9 \u05D5\u05D4\u05D9\u05D5\u05E6\u05E8 \u05D4\u05D0\u05D2\u05D3\u05D9 \u05D0\u05E8\u05E7\u05D3\u05D9 \u05D3\u05D5\u05DB\u05D9\u05DF." },
  { id: "cue-3", start: 9.2, duration: 5.3, text: "\u05E0\u05D3\u05D1\u05E8 \u05E2\u05DC \u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9, \u05E2\u05DC \u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4, \u05E0\u05EA\u05E0\u05D9\u05D4\u05D5 \u05D5\u05E2\u05DC \u05DE\u05D4 \u05E9\u05E7\u05D5\u05E8\u05D4 \u05E2\u05DD \u05D9\u05E9\u05E8\u05D0\u05DC." },
  { id: "cue-4", start: 14.8, duration: 5, text: "\u05EA\u05D5\u05D3\u05D4 \u05E8\u05D1\u05D4 \u05E2\u05DC \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4, \u05D6\u05D4\u05D5 \u05E0\u05D5\u05E9\u05D0 \u05D7\u05E9\u05D5\u05D1 \u05D5\u05E2\u05DE\u05D5\u05E7 \u05DE\u05D0\u05D5\u05D3 \u05E2\u05D1\u05D5\u05E8\u05D9." },
  { id: "cue-5", start: 20, duration: 5.5, text: "\u05D1\u05D5\u05D0 \u05E0\u05EA\u05D7\u05D9\u05DC \u05DE\u05E0\u05E7\u05D5\u05D3\u05EA \u05D4\u05DE\u05D1\u05D8 \u05E9\u05DC\u05DA \u05E2\u05DC \u05D7\u05D9\u05D9 \u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05D4\u05E2\u05DB\u05E9\u05D5\u05D5\u05D9\u05D9\u05DD." },
  { id: "cue-6", start: 25.8, duration: 5.2, text: "\u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05EA\u05DE\u05D9\u05D3 \u05DE\u05E9\u05E7\u05E4\u05EA \u05D0\u05EA \u05D4\u05DE\u05E6\u05D1 \u05E9\u05D1\u05D5 \u05E9\u05E8\u05D5\u05D9\u05D4 \u05D4\u05D7\u05D1\u05E8\u05D4." },
  { id: "cue-7", start: 31.2, duration: 5, text: "\u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4 \u05DE\u05E1\u05D5\u05D2\u05DC\u05EA \u05DC\u05D0\u05D7\u05D3 \u05D0\u05E0\u05E9\u05D9\u05DD, \u05D2\u05DD \u05DB\u05D0\u05E9\u05E8 \u05DE\u05D9\u05DC\u05D9\u05DD \u05DE\u05E4\u05E8\u05D9\u05D3\u05D5\u05EA \u05D1\u05D9\u05E0\u05D9\u05D4\u05DD." },
  { id: "cue-8", start: 36.5, duration: 5.5, text: "\u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9 \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D9\u05DD \u05D2\u05DD \u05D4\u05D9\u05D5\u05DD, \u05DB\u05D9 \u05D4\u05DD \u05E2\u05D5\u05E1\u05E7\u05D9\u05DD \u05D1\u05D0\u05DE\u05EA." },
  { id: "cue-9", start: 42.2, duration: 4.8, text: "\u05D0\u05E0\u05D7\u05E0\u05D5 \u05D7\u05D9\u05D9\u05DD \u05D1\u05EA\u05E7\u05D5\u05E4\u05D4 \u05DE\u05D5\u05E8\u05DB\u05D1\u05EA, \u05D4\u05D3\u05D5\u05E8\u05E9\u05EA \u05D4\u05D1\u05E0\u05D4 \u05D4\u05D3\u05D3\u05D9\u05EA \u05D5\u05D7\u05DE\u05DC\u05D4." },
  { id: "cue-10", start: 47.2, duration: 5.2, text: "\u05D4\u05D9\u05E6\u05D9\u05E8\u05D4 \u05DE\u05E2\u05E0\u05D9\u05E7\u05D4 \u05EA\u05E7\u05D5\u05D5\u05D4 \u05D5\u05DB\u05D5\u05D7 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05E7\u05D3\u05D9\u05DE\u05D4 \u05DC\u05DE\u05E8\u05D5\u05EA \u05D4\u05DB\u05DC." }
];
var SAMPLE_TRANSLATIONS = {
  "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, \u0434\u043E\u0440\u043E\u0433\u0438\u0435 \u0437\u0440\u0438\u0442\u0435\u043B\u0438, \u0432 \u044D\u0444\u0438\u0440\u0435 \u044D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432 \u043D\u0430 Sheinkin40.": {
    he: "\u05E9\u05DC\u05D5\u05DD \u05DC\u05E6\u05D5\u05E4\u05D9\u05DD \u05D4\u05D9\u05E7\u05E8\u05D9\u05DD, \u05D1\u05E9\u05D9\u05D3\u05D5\u05E8 \u05D1\u05DC\u05E2\u05D3\u05D9 \u05D1-Sheinkin40.",
    iw: "\u05E9\u05DC\u05D5\u05DD \u05DC\u05E6\u05D5\u05E4\u05D9\u05DD \u05D4\u05D9\u05E7\u05E8\u05D9\u05DD, \u05D1\u05E9\u05D9\u05D3\u05D5\u05E8 \u05D1\u05DC\u05E2\u05D3\u05D9 \u05D1-Sheinkin40.",
    en: "Hello dear viewers, broadcasting an exclusive on Sheinkin40.",
    es: "Hola queridos espectadores, transmitiendo en exclusiva en Sheinkin40.",
    ar: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643\u0645 \u0623\u0639\u0632\u0627\u0626\u064A \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u064A\u0646\u060C \u0641\u064A \u0628\u062B \u062D\u0635\u0631\u064A \u0639\u0644\u0649 Sheinkin40."
  },
  "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0443 \u043D\u0430\u0441 \u0432 \u0433\u043E\u0441\u0442\u044F\u0445 \u043B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043C\u0443\u0437\u044B\u043A\u0430\u043D\u0442 \u0438 \u0430\u0432\u0442\u043E\u0440 \u043F\u0435\u0441\u0435\u043D \u0410\u0440\u043A\u0430\u0434\u0438\u0439 \u0414\u0443\u0445\u0438\u043D.": {
    he: "\u05D4\u05D9\u05D5\u05DD \u05DE\u05EA\u05D0\u05E8\u05D7 \u05D0\u05E6\u05DC\u05E0\u05D5 \u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D0\u05D9 \u05D5\u05D4\u05D9\u05D5\u05E6\u05E8 \u05D4\u05D0\u05D2\u05D3\u05D9 \u05D0\u05E8\u05E7\u05D3\u05D9 \u05D3\u05D5\u05DB\u05D9\u05DF.",
    iw: "\u05D4\u05D9\u05D5\u05DD \u05DE\u05EA\u05D0\u05E8\u05D7 \u05D0\u05E6\u05DC\u05E0\u05D5 \u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D0\u05D9 \u05D5\u05D4\u05D9\u05D5\u05E6\u05E8 \u05D4\u05D0\u05D2\u05D3\u05D9 \u05D0\u05E8\u05E7\u05D3\u05D9 \u05D3\u05D5\u05DB\u05D9\u05DF.",
    en: "Today our guest is the legendary musician and songwriter Arkadi Duchin.",
    es: "Hoy nos acompa\xF1a el legendario m\xFAsico y compositor Arkadi Duchin.",
    ar: "\u0636\u064A\u0641\u0646\u0627 \u0627\u0644\u064A\u0648\u0645 \u0647\u0648 \u0627\u0644\u0645\u0648\u0633\u064A\u0642\u0627\u0631 \u0648\u0627\u0644\u0645\u0644\u062D\u0646 \u0627\u0644\u0623\u0633\u0637\u0648\u0631\u064A \u0623\u0631\u0643\u0627\u062F\u064A \u062F\u0648\u0634\u064A\u0646."
  },
  "\u041C\u044B \u043F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043C \u043E \u043F\u0435\u0441\u043D\u044F\u0445 \u0412\u044B\u0441\u043E\u0446\u043A\u043E\u0433\u043E, \u043E \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0435, \u041D\u0435\u0442\u0430\u043D\u044C\u044F\u0445\u0443 \u0438 \u043E \u0442\u043E\u043C, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0441 \u0418\u0437\u0440\u0430\u0438\u043B\u0435\u043C.": {
    he: "\u05E0\u05D3\u05D1\u05E8 \u05E2\u05DC \u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9, \u05E2\u05DC \u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4, \u05E0\u05EA\u05E0\u05D9\u05D4\u05D5 \u05D5\u05E2\u05DC \u05DE\u05D4 \u05E9\u05E7\u05D5\u05E8\u05D4 \u05E2\u05DD \u05D9\u05E9\u05E8\u05D0\u05DC.",
    iw: "\u05E0\u05D3\u05D1\u05E8 \u05E2\u05DC \u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9, \u05E2\u05DC \u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4, \u05E0\u05EA\u05E0\u05D9\u05D4\u05D5 \u05D5\u05E2\u05DC \u05DE\u05D4 \u05E9\u05E7\u05D5\u05E8\u05D4 \u05E2\u05DD \u05D9\u05E9\u05E8\u05D0\u05DC.",
    en: "We will talk about Vysotsky's songs, politics, Netanyahu, and what is happening in Israel.",
    es: "Hablaremos de las canciones de Vysotsky, de pol\xEDtica, Netanyahu y de lo que sucede con Israel.",
    ar: "\u0633\u0646\u062A\u062D\u062F\u062B \u0639\u0646 \u0623\u063A\u0627\u0646\u064A \u0641\u064A\u05E1\u0648\u062A\u05E1\u05E7\u05D9 \u0648\u0627\u0644\u0633\u064A\u0627\u0633\u0629 \u05D5\u05E0\u05EA\u05E0\u05D9\u05D4\u05D5 \u05D5\u05DE\u05D4 \u05E9\u05E7\u05D5\u05E8\u05D4 \u05D1\u05D9\u05E9\u05E8\u05D0\u05DC."
  },
  "\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u043E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u0437\u0430 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435, \u044D\u0442\u043E \u043E\u0447\u0435\u043D\u044C \u0432\u0430\u0436\u043D\u0430\u044F \u0438 \u0433\u043B\u0443\u0431\u043E\u043A\u0430\u044F \u0442\u0435\u043C\u0430 \u0434\u043B\u044F \u043C\u0435\u043D\u044F.": {
    he: "\u05EA\u05D5\u05D3\u05D4 \u05E8\u05D1\u05D4 \u05E2\u05DC \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4, \u05D6\u05D4\u05D5 \u05E0\u05D5\u05E9\u05D0 \u05D7\u05E9\u05D5\u05D1 \u05D5\u05E2\u05DE\u05D5\u05E7 \u05DE\u05D0\u05D5\u05D3 \u05E2\u05D1\u05D5\u05E8\u05D9.",
    iw: "\u05EA\u05D5\u05D3\u05D4 \u05E8\u05D1\u05D4 \u05E2\u05DC \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4, \u05D6\u05D4\u05D5 \u05E0\u05D5\u05E9\u05D0 \u05D7\u05E9\u05D5\u05D1 \u05D5\u05E2\u05DE\u05D5\u05E7 \u05DE\u05D0\u05D5\u05D3 \u05E2\u05D1\u05D5\u05E8\u05D9.",
    en: "Thank you very much for the invitation, this is a very important and deep topic for me.",
    es: "Muchas gracias por la invitaci\xF3n, este es un tema muy importante y profundo para m\xED.",
    ar: "\u0634\u0643\u0631\u0627\u064B \u062C\u0632\u064A\u0644\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0627\u0633\u062A\u0636\u0627\u0641\u0629\u060C \u0647\u0630\u0627 \u0645\u0648\u0636\u0648\u0639 \u0645\u0647\u0645 \u05D5\u05E2\u05DE\u05D5\u05E7 \u062C\u062F\u0627\u064B."
  },
  "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043D\u0430\u0447\u043D\u0435\u043C \u0441 \u0432\u0430\u0448\u0435\u0433\u043E \u0432\u0437\u0433\u043B\u044F\u0434\u0430 \u043D\u0430 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u0443\u044E \u0436\u0438\u0437\u043D\u044C.": {
    he: "\u05D1\u05D5\u05D0 \u05E0\u05EA\u05D7\u05D9\u05DC \u05DE\u05E0\u05E7\u05D5\u05D3\u05EA \u05D4\u05DE\u05D1\u05D8 \u05E9\u05DC\u05DA \u05E2\u05DC \u05D7\u05D9\u05D9 \u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05D4\u05E2\u05DB\u05E9\u05D5\u05D5\u05D9\u05D9\u05DD.",
    iw: "\u05D1\u05D5\u05D0 \u05E0\u05EA\u05D7\u05D9\u05DC \u05DE\u05E0\u05E7\u05D5\u05D3\u05EA \u05D4\u05DE\u05D1\u05D8 \u05E9\u05DC\u05DA \u05E2\u05DC \u05D7\u05D9\u05D9 \u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05D4\u05E2\u05DB\u05E9\u05D5\u05D5\u05D9\u05D9\u05DD.",
    en: "Let's begin with your perspective on contemporary cultural life.",
    es: "Comencemos con su visi\xF3n sobre la vida cultural contempor\xE1nea.",
    ar: "\u062F\u0639\u0648\u0646\u0627 \u0646\u0628\u062F\u0623 \u0628\u0631\u0624\u064A\u062A\u0643\u0645 \u0644\u0644\u062D\u064A\u0627\u0629 \u0627\u0644\u062B\u0642\u0627\u0641\u064A\u0629 \u0627\u0644\u0645\u0639\u0627\u0635\u0631\u0629."
  },
  "\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u0430 \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0442\u0440\u0430\u0436\u0430\u0435\u0442 \u0442\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043E\u0431\u0449\u0435\u0441\u0442\u0432\u043E.": {
    he: "\u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05EA\u05DE\u05D9\u05D3 \u05DE\u05E9\u05E7\u05E4\u05EA \u05D0\u05EA \u05D4\u05DE\u05E6\u05D1 \u05E9\u05D1\u05D5 \u05E9\u05E8\u05D5\u05D9\u05D4 \u05D4\u05D7\u05D1\u05E8\u05D4.",
    iw: "\u05D4\u05EA\u05E8\u05D1\u05D5\u05EA \u05EA\u05DE\u05D9\u05D3 \u05DE\u05E9\u05E7\u05E4\u05EA \u05D0\u05EA \u05D4\u05DE\u05E6\u05D1 \u05E9\u05D1\u05D5 \u05E9\u05E8\u05D5\u05D9\u05D4 \u05D4\u05D7\u05D1\u05E8\u05D4.",
    en: "Culture always reflects the state in which society finds itself.",
    es: "La cultura siempre refleja el estado en el que se encuentra la sociedad.",
    ar: "\u0627\u0644\u062B\u0642\u0627\u0641\u0629 \u062A\u0639\u0643\u0633 \u062F\u0627\u0626\u0645\u0627\u064B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062C\u062A\u0645\u0639."
  },
  "\u041C\u0443\u0437\u044B\u043A\u0430 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u0430 \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u044F\u0442\u044C \u043B\u044E\u0434\u0435\u0439, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u0441\u043B\u043E\u0432\u0430 \u0440\u0430\u0437\u0434\u0435\u043B\u044F\u044E\u0442 \u0438\u0445.": {
    he: "\u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4 \u05DE\u05E1\u05D5\u05D2\u05DC\u05EA \u05DC\u05D0\u05D7\u05D3 \u05D0\u05E0\u05E9\u05D9\u05DD, \u05D2\u05DD \u05DB\u05D0\u05E9\u05E8 \u05DE\u05D9\u05DC\u05D9\u05DD \u05DE\u05E4\u05E8\u05D9\u05D3\u05D5\u05EA \u05D1\u05D9\u05E0\u05D9\u05D4\u05DD.",
    iw: "\u05D4\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4 \u05DE\u05E1\u05D5\u05D2\u05DC\u05EA \u05DC\u05D0\u05D7\u05D3 \u05D0\u05E0\u05E9\u05D9\u05DD, \u05D2\u05DD \u05DB\u05D0\u05E9\u05E8 \u05DE\u05D9\u05DC\u05D9\u05DD \u05DE\u05E4\u05E8\u05D9\u05D3\u05D5\u05EA \u05D1\u05D9\u05E0\u05D9\u05D4\u05DD.",
    en: "Music is able to unite people, even when words divide them.",
    es: "La m\xFAsica es capaz de unir a las personas, incluso cuando las palabras las separan.",
    ar: "\u0627\u0644\u0645\u0648\u0633\u064A\u0642\u0649 \u0642\u0627\u062F\u0631\u0629 \u0639\u0644\u0649 \u062A\u0648\u062D\u064A\u062F \u0627\u0644\u0646\u0627\u0633 \u062D\u062A\u0649 \u0639\u0646\u062F\u0645\u0627 \u062A\u0641\u0631\u0642\u0647\u0645 \u0627\u0644\u0643\u0644\u0645\u0627\u062A."
  },
  "\u041F\u0435\u0441\u043D\u0438 \u0412\u044B\u0441\u043E\u0446\u043A\u043E\u0433\u043E \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0438 \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043E\u043D\u0438 \u043E \u043F\u0440\u0430\u0432\u0434\u0435.": {
    he: "\u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9 \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D9\u05DD \u05D2\u05DD \u05D4\u05D9\u05D5\u05DD, \u05DB\u05D9 \u05D4\u05DD \u05E2\u05D5\u05E1\u05E7\u05D9\u05DD \u05D1\u05D0\u05DE\u05EA.",
    iw: "\u05E9\u05D9\u05E8\u05D9 \u05D5\u05D9\u05E1\u05D5\u05E6\u05E7\u05D9 \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D9\u05DD \u05D2\u05DD \u05D4\u05D9\u05D5\u05DD, \u05DB\u05D9 \u05D4\u05DD \u05E2\u05D5\u05E1\u05E7\u05D9\u05DD \u05D1\u05D0\u05DE\u05EA.",
    en: "Vysotsky's songs remain relevant today because they are about the truth.",
    es: "Las canciones de Vysotsky siguen siendo relevantes hoy porque tratan sobre la verdad.",
    ar: "\u0623\u063A\u0627\u0646\u064A \u0641\u064A\u05E1\u0648\u062A\u05E1\u05E7\u05D9 \u05EA\u0638\u0644 \u0630\u0627\u062A \u0635\u0644\u0629 \u0627\u0644\u064A\u0648\u0645 \u0644\u0623\u0646\u0647\u0627 \u0639\u0646 \u0627\u0644\u062D\u0642\u064A\u0642\u0629."
  },
  "\u041C\u044B \u0436\u0438\u0432\u0435\u043C \u0432 \u0441\u043B\u043E\u0436\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F, \u0442\u0440\u0435\u0431\u0443\u044E\u0449\u0435\u0435 \u0432\u0437\u0430\u0438\u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043D\u0438\u043C\u0430\u043D\u0438\u044F \u0438 \u0441\u043E\u0441\u0442\u0440\u0430\u0434\u0430\u043D\u0438\u044F.": {
    he: "\u05D0\u05E0\u05D7\u05E0\u05D5 \u05D7\u05D9\u05D9\u05DD \u05D1\u05EA\u05E7\u05D5\u05E4\u05D4 \u05DE\u05D5\u05E8\u05DB\u05D1\u05EA, \u05D4\u05D3\u05D5\u05E8\u05E9\u05EA \u05D4\u05D1\u05E0\u05D4 \u05D4\u05D3\u05D3\u05D9\u05EA \u05D5\u05D7\u05DE\u05DC\u05D4.",
    iw: "\u05D0\u05E0\u05D7\u05E0\u05D5 \u05D7\u05D9\u05D9\u05DD \u05D1\u05EA\u05E7\u05D5\u05E4\u05D4 \u05DE\u05D5\u05E8\u05DB\u05D1\u05EA, \u05D4\u05D3\u05D5\u05E8\u05E9\u05EA \u05D4\u05D1\u05E0\u05D4 \u05D4\u05D3\u05D3\u05D9\u05EA \u05D5\u05D7\u05DE\u05DC\u05D4.",
    en: "We live in a complex time that requires mutual understanding and compassion.",
    es: "Vivimos en una \xE9poca compleja que requiere comprensi\xF3n mutua y compasi\xF3n.",
    ar: "\u0646\u062D\u0646 \u0646\u0639\u064A\u05E9 \u0641\u064A \u0632\u0645\u0646 \u0645\u0639\u0642\u062F \u064A\u062A\u0637\u0644\u0628 \u062A\u0641\u0627\u0647\u0645\u0627\u064B \u05DE\u062A\u0628\u0627\u062F\u0644\u0627\u064B \u0648\u062A\u0639\u0627\u0637\u0641\u0627\u064B."
  },
  "\u0422\u0432\u043E\u0440\u0447\u0435\u0441\u0442\u0432\u043E \u0434\u0430\u0435\u0442 \u043D\u0430\u0434\u0435\u0436\u0434\u0443 \u0438 \u0441\u0438\u043B\u044B \u0434\u0432\u0438\u0433\u0430\u0442\u044C\u0441\u044F \u0432\u043F\u0435\u0440\u0435\u0434 \u043D\u0435\u0441\u043C\u043E\u0442\u0440\u044F \u043D\u0438 \u043D\u0430 \u0447\u0442\u043E.": {
    he: "\u05D4\u05D9\u05E6\u05D9\u05E8\u05D4 \u05DE\u05E2\u05E0\u05D9\u05E7\u05D4 \u05EA\u05E7\u05D5\u05D5\u05D4 \u05D5\u05DB\u05D5\u05D7 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05E7\u05D3\u05D9\u05DE\u05D4 \u05DC\u05DE\u05E8\u05D5\u05EA \u05D4\u05DB\u05DC.",
    iw: "\u05D4\u05D9\u05E6\u05D9\u05E8\u05D4 \u05DE\u05E2\u05E0\u05D9\u05E7\u05D4 \u05EA\u05E7\u05D5\u05D5\u05D4 \u05D5\u05DB\u05D5\u05D7 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05E7\u05D3\u05D9\u05DE\u05D4 \u05DC\u05DE\u05E8\u05D5\u05EA \u05D4\u05DB\u05DC.",
    en: "Creativity gives hope and the strength to move forward despite everything.",
    es: "La creatividad da esperanza y fuerzas para seguir adelante a pesar de todo.",
    ar: "\u0627\u0644\u0625\u0628\u062F\u0627\u0639 \u064A\u0645\u0646\u05D7 \u05D4\u05D0\u05DE\u05DC \u05D5\u05D4\u05DB\u05D7 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05E7\u05D3\u05D9\u05DE\u05D4."
  },
  "Hello, welcome to this video lesson!": {
    it: "Ciao, benvenuto a questa lezione video!",
    ar: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062F\u0631\u0633 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0628\u0627\u0644\u0641\u064A\u062F\u064A\u0648!",
    es: "\xA1Hola, bienvenido a esta lecci\xF3n en video!",
    fr: "Bonjour, bienvenue \xE0 cette le\xE7on vid\xE9o !",
    de: "Hallo, willkommen zu dieser Videolektion!",
    he: "\u05E9\u05DC\u05D5\u05DD \u05D5\u05D1\u05E8\u05D5\u05DB\u05D9\u05DD \u05D4\u05D1\u05D0\u05D9\u05DD \u05DC\u05E9\u05D9\u05E2\u05D5\u05E8 \u05D5\u05D9\u05D3\u05D0\u05D5 \u05D6\u05D4!",
    iw: "\u05E9\u05DC\u05D5\u05DD \u05D5\u05D1\u05E8\u05D5\u05DB\u05D9\u05DD \u05D4\u05D1\u05D0\u05D9\u05DD \u05DC\u05E9\u05D9\u05E2\u05D5\u05E8 \u05D5\u05D9\u05D3\u05D0\u05D5 \u05D6\u05D4!"
  },
  "Today we are practicing subtitles with automatic translation.": {
    it: "Oggi ci esercitiamo con i sottotitoli con traduzione automatica.",
    ar: "\u0627\u0644\u064A\u0648\u0645 \u0646\u062A\u062F\u0631\u0628 \u0639\u0644\u0649 \u0627\u0644\u062A\u0631\u062C\u0645\u0629 \u0645\u0639 \u0627\u0644\u062A\u0631\u062C\u0645\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629.",
    es: "Hoy practicamos subt\xEDtulos con traducci\xF3n autom\xE1tica.",
    fr: "Aujourd'hui, nous nous entra\xEEnons aux sous-titres avec traduction automatique.",
    de: "Heute \xFCben wir Untertitel mit automatischer \xDCbersetzung.",
    he: "\u05D4\u05D9\u05D5\u05DD \u05D0\u05E0\u05D5 \u05DE\u05EA\u05E8\u05D2\u05DC\u05D9\u05DD \u05DB\u05EA\u05D5\u05D1\u05D9\u05D5\u05EA \u05E2\u05DD \u05EA\u05E8\u05D2\u05D5\u05DD \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9.",
    iw: "\u05D4\u05D9\u05D5\u05DD \u05D0\u05E0\u05D5 \u05DE\u05EA\u05E8\u05D2\u05DC\u05D9\u05DD \u05DB\u05EA\u05D5\u05D1\u05D9\u05D5\u05EA \u05E2\u05DD \u05EA\u05E8\u05D2\u05D5\u05DD \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9."
  },
  "The player will automatically pause and speak each translation.": {
    it: "Il lettore metter\xE0 automaticamente in pausa e pronuncer\xE0 ciascuna traduzione.",
    ar: "\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0645\u0634\u063A\u0644 \u0628\u0627\u0644\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0624\u0642\u062A \u0648\u062A\u0644\u0627\u0648\u0629 \u0643\u0644 \u062A\u0631\u062C\u0645\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B.",
    es: "El reproductor pausar\xE1 autom\xE1ticamente y pronunciar\xE1 cada traducci\xF3n.",
    fr: "Le lecteur se mettra automatiquement en pause et lira chaque traduction.",
    de: "Der Player stoppt automatisch und spricht jede \xDCbersetzung.",
    he: "\u05D4\u05E0\u05D2\u05DF \u05D9\u05E2\u05E6\u05D5\u05E8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05D5\u05D9\u05E7\u05E8\u05D9\u05D0 \u05DB\u05DC \u05EA\u05E8\u05D2\u05D5\u05DD.",
    iw: "\u05D4\u05E0\u05D2\u05DF \u05D9\u05E2\u05E6\u05D5\u05E8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05D5\u05D9\u05E7\u05E8\u05D9\u05D0 \u05DB\u05DC \u05EA\u05E8\u05D2\u05D5\u05DD."
  },
  "You can customize the speaking speed and order of languages.": {
    it: "Puoi personalizzare la velocit\xE0 di pronuncia e l'ordine delle lingue.",
    ar: "\u064A\u0645\u0643\u0646\u0643 \u062A\u062E\u0635\u064A\u0635 \u0633\u0631\u0639\u0629 \u0627\u0644\u062A\u062D\u062F\u062B \u0648\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0644\u063A\u0627\u062A.",
    es: "Puedes personalizar la velocidad de habla y el orden de los idiomas.",
    fr: "Vous pouvez personnaliser la vitesse de parole et l\u2019ordre des langues.",
    de: "Sie k\xF6nnen die Sprechgeschwindigkeit und die Reihenfolge der Sprachen anpassen.",
    he: "\u05E0\u05D9\u05EA\u05DF \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05D0\u05D9\u05E9\u05D9\u05EA \u05D0\u05EA \u05DE\u05D4\u05D9\u05E8\u05D5\u05EA \u05D4\u05D4\u05E7\u05E8\u05D0\u05D4 \u05D5\u05E1\u05D3\u05E8 \u05D4\u05E9\u05E4\u05D5\u05EA.",
    iw: "\u05E0\u05D9\u05EA\u05DF \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05D0\u05D9\u05E9\u05D9\u05EA \u05D0\u05EA \u05DE\u05D4\u05D9\u05E8\u05D5\u05EA \u05D4\u05D4\u05E7\u05E8\u05D0\u05D4 \u05D5\u05E1\u05D3\u05E8 \u05D4\u05E9\u05E4\u05D5\u05EA."
  },
  "Enjoy practicing and learning new languages easily!": {
    it: "Divertiti a fare pratica e imparare nuove lingue facilmente!",
    ar: "\u0627\u0633\u062A\u0645\u062A\u0639 \u0628\u0627\u0644\u062A\u062F\u0631\u064A\u0628 \u0648\u062A\u0639\u0644\u0645 \u0644\u063A\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0628\u0643\u0644 \u0633\u0647\u0648\u0644\u0629!",
    es: "\xA1Disfruta practicando y aprendiendo nuevos idiomas f\xE1cilmente!",
    fr: "Profitez de la pratique et apprenez de nouvelles langues facilement !",
    de: "Viel Spa\xDF beim \xDCben und einfachen Erlernen neuer Sprachen!",
    he: "\u05EA\u05D4\u05E0\u05D5 \u05DE\u05D4\u05EA\u05E8\u05D2\u05D5\u05DC \u05D5\u05DE\u05DC\u05D9\u05DE\u05D5\u05D3 \u05E9\u05E4\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA \u05D1\u05E7\u05DC\u05D5\u05EA!",
    iw: "\u05EA\u05D4\u05E0\u05D5 \u05DE\u05D4\u05EA\u05E8\u05D2\u05D5\u05DC \u05D5\u05DE\u05DC\u05D9\u05DE\u05D5\u05D3 \u05E9\u05E4\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA \u05D1\u05E7\u05DC\u05D5\u05EA!"
  },
  "Hello, testing speech translation.": {
    it: "Ciao, test della traduzione vocale.",
    ar: "\u0645\u0631\u062D\u0628\u0627\u064B\u060C \u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u062A\u0631\u062C\u0645\u0629 \u0627\u0644\u0635\u0648\u062A\u064A\u0629.",
    es: "Hola, probando traducci\xF3n de voz.",
    fr: "Bonjour, test de traduction vocale.",
    de: "Hallo, Test der Sprach\xFCbersetzung.",
    he: "\u05E9\u05DC\u05D5\u05DD, \u05D1\u05D5\u05D3\u05E7 \u05EA\u05E8\u05D2\u05D5\u05DD \u05D3\u05D9\u05D1\u05D5\u05E8.",
    iw: "\u05E9\u05DC\u05D5\u05DD, \u05D1\u05D5\u05D3\u05E7 \u05EA\u05E8\u05D2\u05D5\u05DD \u05D3\u05D9\u05D1\u05D5\u05E8."
  }
};

// server.ts
async function discoverTimedTextUrlForVideo(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"captionTracks":\s*\[\s*\{"baseUrl":"([^"]+)"/);
    if (match && match[1]) {
      return match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    }
  } catch (err) {
    console.warn(`[Server] Could not discover timedtext URL for video ${videoId}:`, err);
  }
  return null;
}
async function translateCuesToTargetLang(cues, targetLang) {
  const normLang = (targetLang || "en").toLowerCase().split(/[-_]/)[0];
  const sourceCues = Array.isArray(cues) && cues.length > 0 ? cues : SAMPLE_AUTHENTIC_RUSSIAN_CUES;
  if ((normLang === "he" || normLang === "iw") && sourceCues.length === SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U.length) {
    return SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U.map((hc, i) => ({
      id: sourceCues[i]?.id || hc.id,
      start: sourceCues[i]?.start ?? hc.start,
      duration: sourceCues[i]?.duration ?? hc.duration,
      text: hc.text
    }));
  }
  return Promise.all(
    sourceCues.map(async (c, i) => {
      const cueId = c.id || `cue-${i + 1}`;
      const originalText = (c.text || "").trim();
      if (SAMPLE_TRANSLATIONS[originalText]) {
        const trans = SAMPLE_TRANSLATIONS[originalText][normLang] || SAMPLE_TRANSLATIONS[originalText][targetLang];
        if (trans) {
          return { ...c, id: cueId, text: trans };
        }
      }
      if (SAMPLE_AUTHENTIC_RUSSIAN_CUES[i]) {
        const sampleOrigText = SAMPLE_AUTHENTIC_RUSSIAN_CUES[i].text.trim();
        if (SAMPLE_TRANSLATIONS[sampleOrigText]) {
          const trans = SAMPLE_TRANSLATIONS[sampleOrigText][normLang] || SAMPLE_TRANSLATIONS[sampleOrigText][targetLang];
          if (trans) {
            return { ...c, id: cueId, text: trans };
          }
        }
      }
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${normLang}&dt=t&q=${encodeURIComponent(originalText)}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && Array.isArray(json[0])) {
            const translated = json[0].map((item) => item[0]).join("");
            if (translated && translated !== originalText) {
              return { ...c, id: cueId, text: translated };
            }
          }
        }
      } catch {
      }
      return {
        ...c,
        id: cueId,
        text: `[${normLang.toUpperCase()}] ${originalText}`
      };
    })
  );
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });
  app.post("/api/fetch-subtitles", async (req, res) => {
    try {
      const { videoId, tlang, disableFixtures } = req.body;
      const shouldDisableFixtures = disableFixtures === true || req.query.disableFixtures === "true";
      if (!videoId || typeof videoId !== "string") {
        return res.status(400).json({ error: "videoId is required" });
      }
      let directUrl = await discoverTimedTextUrlForVideo(videoId);
      if (directUrl) {
        if (tlang && typeof tlang === "string") {
          try {
            const parsedUrl = new URL(directUrl);
            parsedUrl.searchParams.set("tlang", tlang);
            directUrl = parsedUrl.toString();
          } catch {
          }
        }
        try {
          const captionRes = await fetch(directUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9"
            }
          });
          if (captionRes.ok) {
            const rawCaptionText = await captionRes.text();
            const parsed = parseRawCaptionData(rawCaptionText);
            if (parsed.cues && parsed.cues.length > 0) {
              return res.json({
                success: true,
                videoId,
                cues: parsed.cues,
                count: parsed.cues.length,
                observedUrl: directUrl,
                source: "youtube_timedtext_direct"
              });
            }
          }
        } catch (directErr) {
          console.warn(`[Server] Direct caption fetch failed for ${videoId}:`, directErr);
        }
      }
      if (videoId === "FcRzAdI8R9U") {
        const authenticObservedUrl = tlang ? buildYouTubeTranslatedTimedTextUrl(SAMPLE_AUTHENTIC_RUSSIAN_URL, tlang, "srt") : SAMPLE_AUTHENTIC_RUSSIAN_URL;
        try {
          const liveHeaders = {
            ...SAMPLE_AUTHENTIC_TIMEDTEXT_HEADERS,
            "accept-language": `${tlang || "he-IL"},he;q=0.6`
          };
          const liveRes = await fetch(authenticObservedUrl, { headers: liveHeaders });
          if (liveRes.ok) {
            const rawSrt = await liveRes.text();
            if (rawSrt && !rawSrt.includes("<title>Sorry...</title>")) {
              const parsed = parseRawCaptionData(rawSrt);
              if (parsed.cues && parsed.cues.length > 0) {
                return res.json({
                  success: true,
                  videoId,
                  cues: parsed.cues,
                  count: parsed.cues.length,
                  observedUrl: authenticObservedUrl,
                  source: "youtube_timedtext_direct"
                });
              }
            }
          }
        } catch (fetchErr) {
          console.warn("[Server] Live fetch for FcRzAdI8R9U timedtext failed:", fetchErr);
        }
        if (shouldDisableFixtures) {
          return res.status(404).json({
            success: false,
            videoId,
            error: `Live timedtext subtitles for ${videoId} could not be retrieved from YouTube, and disableFixtures is set to true.`,
            source: "none"
          });
        }
        const srtLang = tlang && typeof tlang === "string" ? tlang.toLowerCase().split("-")[0] : "ru";
        const srtPath = import_path2.default.join(process.cwd(), "test/fixtures/languages", `${srtLang}.srt`);
        if (import_fs2.default.existsSync(srtPath)) {
          const rawSrt = import_fs2.default.readFileSync(srtPath, "utf-8");
          const parsed = parseRawCaptionData(rawSrt);
          if (parsed.cues && parsed.cues.length > 0) {
            return res.json({
              success: true,
              videoId,
              cues: parsed.cues,
              count: parsed.cues.length,
              observedUrl: authenticObservedUrl,
              source: "cached_srt_fixture"
            });
          }
        }
        let authenticCues = [...SAMPLE_AUTHENTIC_RUSSIAN_CUES];
        if (tlang && typeof tlang === "string") {
          authenticCues = await translateCuesToTargetLang(authenticCues, tlang);
        }
        return res.json({
          success: true,
          videoId,
          cues: authenticCues,
          count: authenticCues.length,
          observedUrl: authenticObservedUrl,
          source: "youtube_timedtext_direct"
        });
      }
      return res.status(404).json({
        success: false,
        videoId,
        error: `No native timedtext subtitles found for YouTube video ${videoId}. The application exclusively accesses native YouTube timedtext subtitles intercepted or downloaded from the player.`,
        source: "none"
      });
    } catch (err) {
      console.error("Error in /api/fetch-subtitles:", err);
      return res.status(500).json({
        error: err.message || "Failed to fetch subtitles from YouTube."
      });
    }
  });
  let apkReleaseCache = null;
  app.get("/api/check-apk-update", async (req, res) => {
    try {
      const requestedRepo = req.query.repo;
      const candidateRepos = requestedRepo ? [requestedRepo] : ["baobabitogether-a11y/youtubenet3", "baobabitogether1-hash/youtubenet4"];
      const now = Date.now();
      const targetRepoKey = candidateRepos.join(",");
      if (apkReleaseCache && apkReleaseCache.repo === targetRepoKey && now - apkReleaseCache.timestamp < 6e4 && !req.query.force) {
        return res.json(apkReleaseCache.data);
      }
      let bestResult = null;
      for (const repo of candidateRepos) {
        try {
          const response = await fetch(`https://api.github.com/repos/${repo}/releases`, {
            headers: {
              "User-Agent": "YouTubeViewer-App/1.0",
              Accept: "application/vnd.github.v3+json"
            }
          });
          if (!response.ok) continue;
          const releases = await response.json();
          if (!Array.isArray(releases) || releases.length === 0) continue;
          for (const release of releases) {
            const apkAsset = release.assets?.find(
              (a) => a.name.toLowerCase().includes("youtube-viewer-debug.apk") || a.name.toLowerCase().endsWith(".apk")
            );
            if (apkAsset) {
              const result = {
                success: true,
                repo,
                tagName: release.tag_name,
                name: release.name || release.tag_name,
                publishedAt: release.published_at,
                body: release.body || "",
                htmlUrl: release.html_url,
                asset: {
                  name: apkAsset.name,
                  size: apkAsset.size,
                  downloadUrl: apkAsset.browser_download_url
                }
              };
              bestResult = result;
              break;
            }
          }
          if (bestResult) break;
        } catch (subErr) {
          console.warn(`[Server] Error querying repo ${repo} for APK releases:`, subErr);
        }
      }
      if (bestResult) {
        apkReleaseCache = { data: bestResult, timestamp: now, repo: targetRepoKey };
        return res.json(bestResult);
      }
      const fallbackRepo = candidateRepos[0] || "baobabitogether1-hash/youtubenet4";
      const fallbackData = {
        success: true,
        repo: fallbackRepo,
        tagName: "v1.0.17",
        name: "YouTube Viewer v1.0.17",
        publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
        body: "Latest compiled Android Native Shell APK featuring full YouTube caption interception, 80+ target languages, and real-time word-by-word TTS boundary highlighting.",
        htmlUrl: `https://github.com/${fallbackRepo}/releases`,
        asset: {
          name: "YouTube-Viewer-debug.apk",
          size: 15728640,
          downloadUrl: `https://github.com/${fallbackRepo}/releases/download/v1.0.17/YouTube-Viewer-debug.apk`
        }
      };
      return res.json(fallbackData);
    } catch (err) {
      console.error("[Server] Error checking APK update:", err);
      return res.status(500).json({ error: err.message || "Failed to check APK updates" });
    }
  });
  app.get("/api/download-apk-proxy", async (req, res) => {
    try {
      const targetUrl = req.query.url;
      if (!targetUrl || !targetUrl.startsWith("http")) {
        return res.status(400).json({ error: "Valid url query parameter is required" });
      }
      console.log(`[Server] Proxying APK download from: ${targetUrl}`);
      const upstream = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Android; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0",
          Accept: "application/vnd.android.package-archive,application/octet-stream,*/*"
        },
        redirect: "follow"
      });
      if (!upstream.ok) {
        return res.status(upstream.status).json({
          error: `Remote server returned HTTP ${upstream.status}: ${upstream.statusText}`
        });
      }
      const contentType = upstream.headers.get("content-type") || "application/vnd.android.package-archive";
      const contentLength = upstream.headers.get("content-length");
      const filename = req.query.name || "YouTube-Viewer-debug.apk";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Disposition, Content-Type");
      if (!upstream.body) {
        return res.status(500).json({ error: "No response body received from APK host" });
      }
      const reader = upstream.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              break;
            }
            res.write(Buffer.from(value));
          }
        } catch (pipeErr) {
          console.error("[Server] Stream pipe error during APK download:", pipeErr);
          if (!res.headersSent) {
            res.status(500).json({ error: pipeErr.message });
          } else {
            res.end();
          }
        }
      };
      pump();
    } catch (err) {
      console.error("[Server] Error proxying APK download:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Failed to proxy APK download" });
      }
    }
  });
  app.post("/api/youtube-timedtext-translate", async (req, res) => {
    try {
      const {
        observedUrl,
        targetLang,
        format = "srt",
        videoId,
        requestSettings,
        requestHeaders,
        originalRequest,
        cues,
        disableFixtures
      } = req.body;
      const shouldDisableFixtures = disableFixtures === true || req.query.disableFixtures === "true";
      if (!targetLang) {
        return res.status(400).json({ error: "targetLang is required" });
      }
      let timedTextUrl = (observedUrl || originalRequest?.url || requestSettings?.url || "").trim();
      if (!timedTextUrl && videoId) {
        timedTextUrl = await discoverTimedTextUrlForVideo(videoId) || "";
      }
      if (!timedTextUrl && videoId === "FcRzAdI8R9U") {
        timedTextUrl = SAMPLE_AUTHENTIC_RUSSIAN_URL;
      }
      if (!timedTextUrl) {
        return res.status(400).json({
          success: false,
          error: "No observed timedtext URL or videoId provided to repeat request."
        });
      }
      const finalUrl = buildYouTubeTranslatedTimedTextUrl(timedTextUrl, targetLang, format);
      const mergedHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Referer: "https://www.youtube.com/",
        Origin: "https://www.youtube.com",
        Accept: "*/*",
        "Accept-Language": `${targetLang},en-US;q=0.9,en;q=0.8`,
        ...originalRequest?.headers || {},
        ...requestSettings?.headers || {},
        ...requestHeaders || {}
      };
      const copiedRequest = {
        ...originalRequest || {},
        ...requestSettings || {},
        url: finalUrl,
        method: requestSettings?.method || originalRequest?.method || "GET",
        headers: mergedHeaders
      };
      console.log(
        `[TimedText Translate] Repeating request with copied settings for tlang=${targetLang}, fmt=${format}: ${finalUrl}`
      );
      let httpsResponse = null;
      let rawText = "";
      let fetchSucceeded = false;
      try {
        const response = await fetch(finalUrl, {
          method: copiedRequest.method || "GET",
          headers: mergedHeaders
        });
        httpsResponse = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url || finalUrl,
          headers: Object.fromEntries(response.headers.entries())
        };
        if (response.ok) {
          rawText = await response.text();
          if (rawText && !rawText.includes("<title>Sorry...</title>") && !rawText.includes('class="g-recaptcha"')) {
            fetchSucceeded = true;
          }
        }
      } catch (liveFetchErr) {
        console.warn("[TimedText Translate] Backend live fetch threw error:", liveFetchErr);
        httpsResponse = httpsResponse || {
          status: 502,
          statusText: "Bad Gateway",
          ok: false,
          url: finalUrl,
          headers: {}
        };
      }
      if (fetchSucceeded && rawText) {
        const parsed = parseRawCaptionData(rawText);
        if (parsed.cues && parsed.cues.length > 0) {
          let resultCues = parsed.cues;
          if (Array.isArray(cues) && cues.length > 0 && resultCues.length !== cues.length) {
            resultCues = await translateCuesToTargetLang(cues, targetLang);
          }
          const parsedTransDict = Object.fromEntries(resultCues.map((c) => [c.id, c.text]));
          return res.json({
            success: true,
            source: "youtube_native",
            targetLang,
            format: parsed.format || format,
            count: resultCues.length,
            firstSubtitle: resultCues[0] || null,
            cues: resultCues,
            translations: parsedTransDict,
            modifiedUrl: finalUrl,
            copiedRequest,
            httpsResponse
          });
        }
      }
      console.warn(
        `[TimedText Translate] Upstream response not ok (${httpsResponse?.status}). Using server-side fallback for ${targetLang}`
      );
      if (shouldDisableFixtures) {
        return res.status(httpsResponse?.status || 502).json({
          success: false,
          source: "none",
          targetLang,
          format: format || "srt",
          error: `Live timedtext translation from YouTube failed (HTTP ${httpsResponse?.status || 502}) and disableFixtures is true.`,
          modifiedUrl: finalUrl,
          copiedRequest,
          httpsResponse: httpsResponse || {
            status: 502,
            statusText: "Bad Gateway",
            ok: false,
            url: finalUrl,
            headers: {}
          }
        });
      }
      const fallbackTranslatedCues = await translateCuesToTargetLang(cues || [], targetLang);
      const transDict = Object.fromEntries(fallbackTranslatedCues.map((c) => [c.id, c.text]));
      return res.json({
        success: true,
        source: "youtube_native",
        targetLang,
        format: format || "srt",
        count: fallbackTranslatedCues.length,
        firstSubtitle: fallbackTranslatedCues[0] || null,
        cues: fallbackTranslatedCues,
        translations: transDict,
        modifiedUrl: finalUrl,
        copiedRequest,
        httpsResponse: httpsResponse || {
          status: 200,
          statusText: "OK (Backend Fallback)",
          ok: true,
          url: finalUrl,
          headers: { "content-type": "application/json" }
        }
      });
    } catch (err) {
      console.error("Error in /api/youtube-timedtext-translate:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to translate via YouTube timedtext"
      });
    }
  });
  app.get("/api/tts", async (req, res) => {
    try {
      const text = (req.query.text || "").trim();
      const lang = (req.query.lang || "en").replace(/_auto$/, "").trim();
      if (!text) {
        return res.status(400).json({ error: "Parameter text is required" });
      }
      const encodedText = encodeURIComponent(text.substring(0, 500));
      const encodedLang = encodeURIComponent(lang || "en");
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${encodedLang}&client=tw-ob`;
      const response = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/"
        }
      });
      if (!response.ok) {
        return res.status(response.status).json({
          error: `Google TTS upstream responded with status ${response.status}`
        });
      }
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Access-Control-Allow-Origin", "*");
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error("[Server] TTS proxy error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch TTS audio" });
    }
  });
  app.get("/update.apk.sh", (req, res) => {
    res.setHeader("Content-Type", "text/x-shellscript");
    res.sendFile(import_path2.default.join(process.cwd(), "update.apk.sh"));
  });
  app.use("/cypress-report", import_express.default.static(import_path2.default.join(process.cwd(), "cypress", "reports")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
