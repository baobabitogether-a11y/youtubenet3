import { CaptionCue } from '../types';

/**
 * Authentic Test and Sample Fixtures
 * Centralizes URLs, observed timedtext streams, and mock subtitle fixtures.
 */

export const SAMPLE_AUTHENTIC_RUSSIAN_URL =
  'https://www.youtube.com/api/timedtext?v=FcRzAdI8R9U&ei=IgqnasHxK-PlxN8PtNy9mAk&caps=asr&opi=112496729&exp=xpe&xoaf=5&xowf=1&xospf=1&hl=en-GB&ip=0.0.0.0&ipbits=0&expire=1789357202&sparams=ip%2Cipbits%2Cexpire%2Cv%2Cei%2Ccaps%2Copi%2Cexp%2Cxoaf&signature=6F0A50A646D36C936CF08C81E3702F28F7097F32.2BA8D9DB6AC9EA7432E53BA37171C0D7C9B3E5D6&key=yt8&kind=asr&lang=ru&potc=1&pot=MljuxV9kEE2ck-6E1TfArA74newqYy3DyWzY0uJcGahUzcJZ5P420d2bDCdzceWegqPMG6vAM4W9-dWo1CHmF-vE7csjIK76JiUqXREGzeh2xbTX0UV9ybSs&fmt=srt&xorb=2&xobt=3&xovt=3&cbr=Chrome&cbrver=153.0.0.0&c=WEB&cver=2.20260911.01.00&cplayer=UNIPLAYER&cos=Windows&cosver=10.0&cplatform=DESKTOP';

export const SAMPLE_AUTHENTIC_TIMEDTEXT_HEADERS: Record<string, string> = {
  'accept': '*/*',
  'accept-language': 'he-IL,he;q=0.6',
  'referer': 'https://www.youtube.com/watch?v=FcRzAdI8R9U',
  'sec-ch-ua': '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
  'sec-ch-ua-arch': '"x86"',
  'sec-ch-ua-bitness': '"64"',
  'sec-ch-ua-full-version-list': '"Google Chrome";v="153.0.0.0", "Not_A Brand";v="8.0.0.0", "Chromium";v="153.0.0.0"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-model': '""',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua-platform-version': '"19.0.0"',
  'sec-ch-ua-wow64': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'sec-gpc': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
  'x-goog-authuser': '0',
  'x-youtube-client-name': '1',
  'x-youtube-client-version': '2.20260911.01.00',
  'x-youtube-device': 'cbr=Chrome&cbrver=153.0.0.0&ceng=WebKit&cengver=537.36&cos=Windows&cosver=10.0&cplatform=DESKTOP',
  'x-youtube-identity-token': 'QUM4Zm9rUmdOVm9JZU8wNTV2ak1NMXZTajI4Q3w=',
  'x-youtube-page-cl': '979575444',
  'x-youtube-page-label': 'youtube.desktop.web_20260911_01_RC00',
  'x-youtube-time-zone': 'Asia/Jerusalem',
  'x-youtube-utc-offset': '180',
};

export const SAMPLE_AUTHENTIC_RUSSIAN_CUES: CaptionCue[] = [
  { id: 'cue-1', start: 0.0, duration: 4.2, text: 'Здравствуйте, дорогие зрители, в эфире эксклюзив на Sheinkin40.' },
  { id: 'cue-2', start: 4.5, duration: 4.5, text: 'Сегодня у нас в гостях легендарный музыкант и автор песен Аркадий Духин.' },
  { id: 'cue-3', start: 9.2, duration: 5.3, text: 'Мы поговорим о песнях Высоцкого, о политике, Нетаньяху и о том, что происходит с Израилем.' },
  { id: 'cue-4', start: 14.8, duration: 5.0, text: 'Спасибо огромное за приглашение, это очень важная и глубокая тема для меня.' },
  { id: 'cue-5', start: 20.0, duration: 5.5, text: 'Давайте начнем с вашего взгляда на современную культурную жизнь.' },
  { id: 'cue-6', start: 25.8, duration: 5.2, text: 'Культура всегда отражает то состояние, в котором находится общество.' },
  { id: 'cue-7', start: 31.2, duration: 5.0, text: 'Музыка способна объединять людей, даже когда слова разделяют их.' },
  { id: 'cue-8', start: 36.5, duration: 5.5, text: 'Песни Высоцкого остаются актуальными и сегодня, потому что они о правде.' },
  { id: 'cue-9', start: 42.2, duration: 4.8, text: 'Мы живем в сложное время, требующее взаимного понимания и сострадания.' },
  { id: 'cue-10', start: 47.2, duration: 5.2, text: 'Творчество дает надежду и силы двигаться вперед несмотря ни на что.' },
];

export const SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U: CaptionCue[] = [
  { id: 'cue-1', start: 0.0, duration: 4.2, text: 'שלום לצופים היקרים, בשידור בלעדי ב-Sheinkin40.' },
  { id: 'cue-2', start: 4.5, duration: 4.5, text: 'היום מתארח אצלנו המוזיקאי והיוצר האגדי ארקדי דוכין.' },
  { id: 'cue-3', start: 9.2, duration: 5.3, text: 'נדבר על שירי ויסוצקי, על פוליטיקה, נתניהו ועל מה שקורה עם ישראל.' },
  { id: 'cue-4', start: 14.8, duration: 5.0, text: 'תודה רבה על ההזמנה, זהו נושא חשוב ועמוק מאוד עבורי.' },
  { id: 'cue-5', start: 20.0, duration: 5.5, text: 'בוא נתחיל מנקודת המבט שלך על חיי התרבות העכשוויים.' },
  { id: 'cue-6', start: 25.8, duration: 5.2, text: 'התרבות תמיד משקפת את המצב שבו שרויה החברה.' },
  { id: 'cue-7', start: 31.2, duration: 5.0, text: 'המוזיקה מסוגלת לאחד אנשים, גם כאשר מילים מפרידות ביניהם.' },
  { id: 'cue-8', start: 36.5, duration: 5.5, text: 'שירי ויסוצקי נשארים רלוונטיים גם היום, כי הם עוסקים באמת.' },
  { id: 'cue-9', start: 42.2, duration: 4.8, text: 'אנחנו חיים בתקופה מורכבת, הדורשת הבנה הדדית וחמלה.' },
  { id: 'cue-10', start: 47.2, duration: 5.2, text: 'היצירה מעניקה תקווה וכוח להמשיך קדימה למרות הכל.' },
];

export const SAMPLE_ENGLISH_PRACTICE_CUES: CaptionCue[] = [
  { id: 'cue-1', start: 0.8, duration: 3.8, text: 'Hello and welcome to this English language practice lesson.' },
  { id: 'cue-2', start: 4.8, duration: 4.2, text: 'In this lesson, we will focus on everyday conversational expressions.' },
  { id: 'cue-3', start: 9.2, duration: 4.5, text: 'Listen carefully to the pronunciation of each phrase.' },
  { id: 'cue-4', start: 14.0, duration: 3.5, text: 'Repeat each sentence after the speaker to improve fluency.' },
  { id: 'cue-5', start: 18.0, duration: 4.0, text: 'Great job, keep up the regular practice every day!' },
];

export const AUTHENTIC_FIXTURES: Record<string, { observedUrl: string; cues: CaptionCue[] }> = {
  FcRzAdI8R9U: {
    observedUrl: SAMPLE_AUTHENTIC_RUSSIAN_URL,
    cues: SAMPLE_AUTHENTIC_RUSSIAN_CUES,
  },
  HGEyIt2bMiE: {
    observedUrl: 'https://www.youtube.com/api/timedtext?v=HGEyIt2bMiE&lang=en&fmt=json3',
    cues: SAMPLE_ENGLISH_PRACTICE_CUES,
  },
};
