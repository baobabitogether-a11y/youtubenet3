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

/**
 * Sample / Mock Translations for Offline Resilience & Deterministic Testing
 */
export const SAMPLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Здравствуйте, дорогие зрители, в эфире эксклюзив на Sheinkin40.': {
    he: 'שלום לצופים היקרים, בשידור בלעדי ב-Sheinkin40.',
    iw: 'שלום לצופים היקרים, בשידור בלעדי ב-Sheinkin40.',
    en: 'Hello dear viewers, broadcasting an exclusive on Sheinkin40.',
    es: 'Hola queridos espectadores, transmitiendo en exclusiva en Sheinkin40.',
    ar: 'مرحباً بكم أعزائي المشاهدين، في بث حصري على Sheinkin40.',
  },
  'Сегодня у нас в гостях легендарный музыкант и автор песен Аркадий Духин.': {
    he: 'היום מתארח אצלנו המוזיקאי והיוצר האגדי ארקדי דוכין.',
    iw: 'היום מתארח אצלנו המוזיקאי והיוצר האגדי ארקדי דוכין.',
    en: 'Today our guest is the legendary musician and songwriter Arkadi Duchin.',
    es: 'Hoy nos acompaña el legendario músico y compositor Arkadi Duchin.',
    ar: 'ضيفنا اليوم هو الموسيقار والملحن الأسطوري أركادي دوشين.',
  },
  'Мы поговорим о песнях Высоцкого, о политике, Нетаньяху и о том, что происходит с Израилем.': {
    he: 'נדבר על שירי ויסוצקי, על פוליטיקה, נתניהו ועל מה שקורה עם ישראל.',
    iw: 'נדבר על שירי ויסוצקי, על פוליטיקה, נתניהו ועל מה שקורה עם ישראל.',
    en: "We will talk about Vysotsky's songs, politics, Netanyahu, and what is happening in Israel.",
    es: 'Hablaremos de las canciones de Vysotsky, de política, Netanyahu y de lo que sucede con Israel.',
    ar: 'سنتحدث عن أغاني فيסوتסקי والسياسة ונתניהו ומה שקורה בישראל.',
  },
  'Спасибо огромное за приглашение, это очень важная и глубокая тема для меня.': {
    he: 'תודה רבה על ההזמנה, זהו נושא חשוב ועמוק מאוד עבורי.',
    iw: 'תודה רבה על ההזמנה, זהו נושא חשוב ועמוק מאוד עבורי.',
    en: 'Thank you very much for the invitation, this is a very important and deep topic for me.',
    es: 'Muchas gracias por la invitación, este es un tema muy importante y profundo para mí.',
    ar: 'شكراً جزيلاً على الاستضافة، هذا موضوع مهم ועמוק جداً.',
  },
  'Давайте начнем с вашего взгляда на современную культурную жизнь.': {
    he: 'בוא נתחיל מנקודת המבט שלך על חיי התרבות העכשוויים.',
    iw: 'בוא נתחיל מנקודת המבט שלך על חיי התרבות העכשוויים.',
    en: "Let's begin with your perspective on contemporary cultural life.",
    es: 'Comencemos con su visión sobre la vida cultural contemporánea.',
    ar: 'دعونا نبدأ برؤيتكم للحياة الثقافية المعاصرة.',
  },
  'Культура всегда отражает то состояние, в котором находится общество.': {
    he: 'התרבות תמיד משקפת את המצב שבו שרויה החברה.',
    iw: 'התרבות תמיד משקפת את המצב שבו שרויה החברה.',
    en: 'Culture always reflects the state in which society finds itself.',
    es: 'La cultura siempre refleja el estado en el que se encuentra la sociedad.',
    ar: 'الثقافة تعكس دائماً حالة المجتمع.',
  },
  'Музыка способна объединять людей, даже когда слова разделяют их.': {
    he: 'המוזיקה מסוגלת לאחד אנשים, גם כאשר מילים מפרידות ביניהם.',
    iw: 'המוזיקה מסוגלת לאחד אנשים, גם כאשר מילים מפרידות ביניהם.',
    en: 'Music is able to unite people, even when words divide them.',
    es: 'La música es capaz de unir a las personas, incluso cuando las palabras las separan.',
    ar: 'الموسيقى قادرة على توحيد الناس حتى عندما تفرقهم الكلمات.',
  },
  'Песни Высоцкого остаются актуальными и сегодня, потому что они о правде.': {
    he: 'שירי ויסוצקי נשארים רלוונטיים גם היום, כי הם עוסקים באמת.',
    iw: 'שירי ויסוצקי נשארים רלוונטיים גם היום, כי הם עוסקים באמת.',
    en: "Vysotsky's songs remain relevant today because they are about the truth.",
    es: 'Las canciones de Vysotsky siguen siendo relevantes hoy porque tratan sobre la verdad.',
    ar: 'أغاني فيסوتסקי תظل ذات صلة اليوم لأنها عن الحقيقة.',
  },
  'Мы живем в сложное время, требующее взаимного понимания и сострадания.': {
    he: 'אנחנו חיים בתקופה מורכבת, הדורשת הבנה הדדית וחמלה.',
    iw: 'אנחנו חיים בתקופה מורכבת, הדורשת הבנה הדדית וחמלה.',
    en: 'We live in a complex time that requires mutual understanding and compassion.',
    es: 'Vivimos en una época compleja que requiere comprensión mutua y compasión.',
    ar: 'نحن نعيש في زمن معقد يتطلب تفاهماً מتبادلاً وتعاطفاً.',
  },
  'Творчество дает надежду и силы двигаться вперед несмотря ни на что.': {
    he: 'היצירה מעניקה תקווה וכוח להמשיך קדימה למרות הכל.',
    iw: 'היצירה מעניקה תקווה וכוח להמשיך קדימה למרות הכל.',
    en: 'Creativity gives hope and the strength to move forward despite everything.',
    es: 'La creatividad da esperanza y fuerzas para seguir adelante a pesar de todo.',
    ar: 'الإبداع يمنח האמל והכח להמשיך קדימה.',
  },
  'Hello, welcome to this video lesson!': {
    it: 'Ciao, benvenuto a questa lezione video!',
    ar: 'مرحباً بكم في هذا الدرس التعليمي بالفيديو!',
    es: '¡Hola, bienvenido a esta lección en video!',
    fr: 'Bonjour, bienvenue à cette leçon vidéo !',
    de: 'Hallo, willkommen zu dieser Videolektion!',
    he: 'שלום וברוכים הבאים לשיעור וידאו זה!',
    iw: 'שלום וברוכים הבאים לשיעור וידאו זה!',
  },
  'Today we are practicing subtitles with automatic translation.': {
    it: 'Oggi ci esercitiamo con i sottotitoli con traduzione automatica.',
    ar: 'اليوم نتدرب على الترجمة مع الترجمة التلقائية.',
    es: 'Hoy practicamos subtítulos con traducción automática.',
    fr: "Aujourd'hui, nous nous entraînons aux sous-titres avec traduction automatique.",
    de: 'Heute üben wir Untertitel mit automatischer Übersetzung.',
    he: 'היום אנו מתרגלים כתוביות עם תרגום אוטומטי.',
    iw: 'היום אנו מתרגלים כתוביות עם תרגום אוטומטי.',
  },
  'The player will automatically pause and speak each translation.': {
    it: 'Il lettore metterà automaticamente in pausa e pronuncerà ciascuna traduzione.',
    ar: 'سيقوم المشغل بالإيقاف المؤقت وتلاوة كل ترجمة تلقائياً.',
    es: 'El reproductor pausará automáticamente y pronunciará cada traducción.',
    fr: 'Le lecteur se mettra automatiquement en pause et lira chaque traduction.',
    de: 'Der Player stoppt automatisch und spricht jede Übersetzung.',
    he: 'הנגן יעצור אוטומטית ויקריא כל תרגום.',
    iw: 'הנגן יעצור אוטומטית ויקריא כל תרגום.',
  },
  'You can customize the speaking speed and order of languages.': {
    it: "Puoi personalizzare la velocità di pronuncia e l'ordine delle lingue.",
    ar: 'يمكنك تخصيص سرعة التحدث وترتيب اللغات.',
    es: 'Puedes personalizar la velocidad de habla y el orden de los idiomas.',
    fr: 'Vous pouvez personnaliser la vitesse de parole et l’ordre des langues.',
    de: 'Sie können die Sprechgeschwindigkeit und die Reihenfolge der Sprachen anpassen.',
    he: 'ניתן להתאים אישית את מהירות ההקראה וסדר השפות.',
    iw: 'ניתן להתאים אישית את מהירות ההקראה וסדר השפות.',
  },
  'Enjoy practicing and learning new languages easily!': {
    it: 'Divertiti a fare pratica e imparare nuove lingue facilmente!',
    ar: 'استمتع بالتدريب وتعلم لغات جديدة بكل سهولة!',
    es: '¡Disfruta practicando y aprendiendo nuevos idiomas fácilmente!',
    fr: 'Profitez de la pratique et apprenez de nouvelles langues facilement !',
    de: 'Viel Spaß beim Üben und einfachen Erlernen neuer Sprachen!',
    he: 'תהנו מהתרגול ומלימוד שפות חדשות בקלות!',
    iw: 'תהנו מהתרגול ומלימוד שפות חדשות בקלות!',
  },
  'Hello, testing speech translation.': {
    it: 'Ciao, test della traduzione vocale.',
    ar: 'مرحباً، اختبار الترجمة الصوتية.',
    es: 'Hola, probando traducción de voz.',
    fr: 'Bonjour, test de traduction vocale.',
    de: 'Hallo, Test der Sprachübersetzung.',
    he: 'שלום, בודק תרגום דיבור.',
    iw: 'שלום, בודק תרגום דיבור.',
  },
};
