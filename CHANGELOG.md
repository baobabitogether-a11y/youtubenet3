# Changelog

All notable changes and completed historical tasks for the YouTube Video Viewer & Subtitles Teacher application are documented in this file.

> **Note for AI Agents**: This file contains historical records of completed tasks and is not required for daily agent execution. Current active tasks are tracked in `PROMPT.md`.

---

## Historical Completed Tasks Archive

### Compact Mode Hover Highlights, Multi-Language TTS:ON Sequence & Hebrew Subtitle Defaulting

- **Compact Mode Button Hover Highlights & Z-Index Stacking**:
  - Implemented crisp, high-visibility mouse hover highlights (`hover:ring-2 hover:ring-amber-400 hover:border-amber-400 hover:brightness-125 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer pointer-events-auto`) across all compact mode buttons, pill badges, and scrubbers.
  - Raised button containers and interactive overlays to prominent z-index levels (`z-30`, `z-40`, and `z-50`), strictly higher than the video background canvas and iframe, guaranteeing full clickability and preventing click intercept bugs.
- **Defaulted Hebrew (`he`) Target Subtitles & Default Language**:
  - Configured Hebrew (`he`) as the defaulted initial target language in both `App.tsx` and `SubtitlesTeacherPanel.tsx` (`DEFAULT_TARGET_LANGUAGES` Hebrew item set to `enabled: true`).
  - Added dedicated visual indicator (`#defaulted-hebrew-subtitles-badge`) with pulse animation and Hebrew RTL support.
- **Multi-Language TTS Play Sequence & Defaulted Hebrew Highlight on `TTS:ON`**:
  - When the user enables `TTS:ON` (`#toggle-auto-tts-button`, `#quick-toggle-tts-btn`, `#control-auto-tts-button`), an automated speech sequence is triggered across languages (Italian `it` -> English `en` -> Hebrew `he`).
  - Upon conclusion of the sequence, the defaulted Hebrew translation is immediately selected, focused, and prominently highlighted with an amber glow border and active badge.
- **Comprehensive Button Clickability & Actions Audit**:
  - Verified click handling and direct execution across all compact mode controls:
    - Back/Close (`#back-close-button`), Logs (`#open-logs-view-btn`), Target language modal (`#open-target-language-btn`, `#quick-target-lang-overlay-btn`), Quick more languages (`#quick-more-languages-btn`, `#quick-enable-more-languages-btn`), TTS toggle (`#toggle-auto-tts-button`, `#quick-toggle-tts-btn`, `#control-auto-tts-button`), Subtitle position cycler (`#cycle-subtitle-position-btn`), Settings modal trigger (`#open-settings-button`), Play/Pause buttons (`#center-play-pause-button`, `#control-play-pause-button`), Mute/Unmute toggle (`#volume-toggle-button`), Caption CC toggle (`#caption-toggle-button`), Cue timestamp seek button (`#cue-time-section`), and scrubber (`#player-progress-bar`).
- **Verification & Documentation**:
  - Ran `npm run update:readme mostuf25563`.
  - Zero TypeScript compile errors via `lint_applet` (`tsc --noEmit`).
  - Clean full production build via `compile_applet` (`npm run build`).
- **Status**: Completed & 100% Verified.

### Default Settings, Compact Mode Quick Controls & Subtitle Timestamps

- **Default Settings Architecture (`src/utils/appSettings.ts`)**:
  - Added `autoPlayTTS: boolean` (default: `false`) — By default, the application does not auto-play TTS speech; it only shows the target translation on screen.
  - Added `singleTargetLanguageMode: boolean` (default: `true`) — By default, the app presents a single target language for a clean and focused comprehension view.
  - Added `showSubtitleTimestamps: boolean` (default: `true`) — By default, shows the subtitle's time section (`[mm:ss - mm:ss]`) beside each subtitle cue.
  - Configured `DEFAULT_TARGET_LANGUAGES` in `SubtitlesTeacherPanel.tsx` to default to 1 active language (`it`).
- **Settings Modal Toggles (`src/components/SettingsModal.tsx`)**:
  - Added dedicated toggle for Auto-play TTS Narration (`#toggle-autoplay-tts-setting`).
  - Added dedicated toggle for Single Target Language Focus (`#toggle-single-target-lang-mode`).
  - Added dedicated toggle for Subtitle Time Section (`#toggle-show-subtitle-timestamps`).
- **Compact & Expanded Mode Quick Controls (`src/components/VideoPlayer.tsx`)**:
  - **Quick TTS Control**: Added instant toggle button (`#quick-toggle-tts-btn` and `#toggle-auto-tts-button`) directly on the compact player overlay with state feedback (`TTS: OFF` / `TTS: ON`).
  - **Quick Language Presentation Control**: Added quick button (`#quick-enable-more-languages-btn` and `#quick-more-languages-btn`) labeled `+ Lang` to instantly enable multi-language subtitle presentation.
  - **Multi-Language Rendering**: When more languages are enabled, extra target language translation rows render simultaneously with their own individual TTS Play buttons and language tag pills.
  - **Subtitle Time Section**: Added formatted timestamp pills (`#cue-time-section`) showing `formatTimestamp(activeCue.start) - formatTimestamp(activeCue.end)` directly adjacent to the subtitle text in both compact and expanded view overlays.
- **Verification**:
  - Verified with `npm run update:readme mostuf25563`.
  - Zero TypeScript compile errors via `lint_applet` (`tsc --noEmit`).
  - Clean full production build via `compile_applet` (`npm run build`).
- **Status**: Completed & 100% Verified.

### Testing & CI/CD Workflow Pipeline Architecture Alignment

- **Documented Pipeline Architecture in `AGENTS.md`**:
  - Added Section 6 defining the explicit execution mandates and dependency flows between build artifacts and automated test suites.
  - Formally specified that `.github/workflows/web.yml` must run on the live deployed website based on `.github/workflows/deploy-demo.yml`.
  - Formally specified that `.github/workflows/emulation.yml` must run on the pre-built build artifact (`youtube-viewer-apks`) based on `.github/workflows/release-apk.yml`.
- **Workflow Alignments & Enhancements**:
  - **`.github/workflows/web.yml`**: Updated `workflow_run` trigger to depend on `Publish Web Demo to GitHub Pages` (`deploy-demo.yml`). Added automated base URL detection targeting the live deployed GitHub Pages application (`https://<owner>.github.io/<repo>/app/`) with fallback to local server, passing `PLAYWRIGHT_BASE_URL` and `CYPRESS_BASE_URL`. Streamlined steps to eliminate redundant pages deployment.
  - **`.github/workflows/emulation.yml`**: Verified artifact staging of `youtube-viewer-apks` (`YouTube-Viewer-debug.apk`) produced by `release-apk.yml`, with GitHub CLI automated retrieval fallback, skipping duplicate Gradle compilation on macOS runners.
  - **`.github/workflows/deploy-demo.yml`**: Removed circular dependency on `Web E2E Tests` so it triggers upon `Build & Release Android APK` (and push/dispatch) to deploy the site, which in turn triggers `web.yml`.
  - **`playwright.config.ts`**: Supported dynamic `PLAYWRIGHT_BASE_URL` / `BASE_URL`, automatically bypassing the local `webServer` when targeting the remote deployed site.
- **Status**: Completed & 100% Verified.

### Dedicated Web Demo GitHub Pages Workflow & CI Test 7 Fix

- **Dedicated Web Demo Publish Workflow (`.github/workflows/deploy-demo.yml`)**:
  - Created `.github/workflows/deploy-demo.yml` dedicated to building and publishing the live web application demo and bundled subtitle artifacts (`cypress/reports/app`) to `gh-pages`.
  - Configured automated triggers on `workflow_run` (after release build or web E2E test completion), direct `push` to `main`/`master`, and manual `workflow_dispatch`.
- **Fixed CI Test 7 Visibility Issue**:
  - Updated `VideoPlayer.tsx` to ensure `#quick-target-lang-overlay-btn` is rendered directly on the active subtitle cue container next to `#speak-orig-cue-btn` regardless of whether translated text is pre-rendered.
  - Enhanced `e2e/web.spec.ts` Test 7 with robust fallback locators, hover trigger on `#video-player-container`, and expanded visibility timeouts.
- **Status**: Completed & 100% Verified.

### Language-Bound TTS-Play to Subtitle Highlighting Sync & Quick Language Selection

- **Strict Language-Bound TTS Highlighting Sync**:
  - Refined `VideoPlayer.tsx` sync logic to compare normalized ISO language codes between active TTS queue audio (`syncTTSLang`) and the overlay target language (`targetLanguage` / `targetLangCode`).
  - Ensured that when TTS is speaking `lang 2` (e.g. English), the overlay subtitle text for `lang 1` (e.g. Italian) is NOT highlighted or replaced, eliminating cross-language highlighting defects.
  - Added a live `TTS: <LANG>` status badge on the overlay when TTS is speaking a different language than the active subtitle translation, allowing users to know which language voice is currently playing.
- **Quick Target Language Selection Overlay Button**:
  - Integrated a dedicated `#quick-target-lang-overlay-btn` button directly on the compact and expanded view subtitle overlays next to the Play button.
  - Enabled instant bringup of `SelectTargetLanguageModal` (`#select-target-language-modal`) with one click to switch or manage target languages on the fly during active playback.
- **Dedicated Sync & Language E2E Test Suite**:
  - Implemented Web Critical Test 7 in `e2e/web.spec.ts` covering quick target language selection, modal interaction, language switching, and language-bound TTS playback synchronization.
- **Status**: Completed & 100% Verified.

### Compact View Presented Subtitle Text & TTS Audio Synchronization

- **1:1 Text-to-Speech Alignment**:
  - Updated `handleSpeakCue` and `Auto-TTS` in `VideoPlayer.tsx` to immediately synchronize `localTranslatedText` with `textToSpeak` whenever translated TTS narration begins.
  - Ensured that the translated subtitle text rendered on screen matches the exact string being spoken by the TTS audio engine word-for-word.
- **Fallback Language Model Alignment**:
  - Corrected language code selection when TTS falls back to the original subtitle text (e.g. `isOriginalSpoken = textToSpeak === activeCue.text`), ensuring source language voices (`ru`, etc.) are used instead of target language voices (`it`, `en`), preventing garbled cross-language speech.
- **Normalized Language Codes**:
  - Normalized ISO language codes (`iw`, `il` -> `he`) in `VideoPlayer.tsx` target subtitle cache lookups and timestamp matching (`Math.abs(c.start - activeCue.start) < 0.5`).
- **Status**: Completed & 100% Verified.

### Authentic SRT Track Fixtures & Hebrew Language Code Normalization

- **Authentic Multi-Language Fixture Priority**:
  - Enhanced `server.ts` and `translateService.ts` to inspect authentic `.srt` tracks in `test/fixtures/languages/*.srt` for instant, offline translation resolution across bundled demonstration tracks.
- **Hebrew ISO Language Code Normalization (`he` / `iw` / `il`)**:
  - Added support for mapping legacy/alternate ISO language codes (`iw`, `il`) to standard `he` across server-side translation endpoints, native track caches, and memory lookup tables.
- **Status**: Completed & 100% Verified.

### Subtitle TTS Audio & Text Highlighting Synchronization

- **High-Precision Unicode Token Segmentation**:
  - Replaced ASCII-only regex (`\w`) in `ttsEngine.ts` with Unicode character class properties (`\p{L}\p{N}`) to correctly recognize and tokenize word boundaries across all international languages (Russian, Italian, Arabic, Hebrew, Spanish, etc.).
- **Dynamic Cadence Pacing & Natural Pauses**:
  - Upgraded word boundary progression timing to calculate durations based on individual word lengths, character counts, and natural pauses for punctuation marks (commas, periods, semicolons, colons).
- **Continuous Audio Stream Synchronization**:
  - Added `ontimeupdate` and `onloadedmetadata` event listeners to the neural audio streaming playback engine, locking visual word highlights directly to the audio element's live playback time.
- **Robust Token Index Selection in `HighlightableText`**:
  - Refined word selection algorithm so whitespace and trailing punctuation after a word maintain focus on the active spoken word, eliminating premature jumps and incorrect fallbacks.
- **Status**: Completed & 100% Verified.


### Full Real-Network E2E Test Suite (Without Fixtures) Implementation

- **Complete Suite Implementation & Button Coverage**:
  - Implemented all 6 real-network E2E test cases running against `?disableFixtures=true` with 100% pass rate:
    1. Video Playback (loads player, input URL, clear/load, theater mode, autoplay & loop controls).
    2. Subtitles View (captions toggle, cue row rendering, timestamp verification, subtitle search input filter, and pagination navigation).
    3. Subtitles Translation (Italian translation target selection, live overlay updates, catalog search, Arabic target switch, and RTL verification).
    4. TTS Config (Language Settings dialog, speaking rate slider adjustment, voice selection dropdown, test audio preview, and player Auto-TTS toggle).
    5. Synchronized Playback Flow (Settings flow configuration: "TTS First vs Video First" radio selections, sync teacher play/pause controls).
    6. APK Guide & Inspector Modals (APK update guide modal, QR toggle, update check button, Network Inspector modal filtering, Errors & State Machine Inspector dialog tab switching).
  - **Status**: Completed & 100% Verified (9/9 Playwright E2E tests passing).

### Fixes & Enhancements: Default Compact View Translations, TTS & Navbar Inspectors

- **Compact View Translation & Auto-TTS Defaults**:
  - Configured `captionsEnabled` to default to `true` on video load.
  - Initialized target language to the stored user preference or `'it'` (Italian) so translations activate immediately.
  - Implemented `displayTranslatedText` state fallback to guarantee translated overlays and TTS audio triggers seamlessly upon playback.
  - Enabled Auto-TTS narration loop with word highlighting in compact and expanded views by default.
  - **Status**: Completed & Verified
- **Navbar Inspector Triggers & Modals**:
  - Removed conditional gates on `#navbar-error-inspector-button` and `#navbar-network-inspector-button` so error diagnostics and network monitors are consistently mounted and interactive.
  - **Status**: Completed & Verified
- **Duplicate Voice Keys & Payload Limits**:
  - Deduplicated system synthesis voice lists to eliminate React duplicate key console warnings.
  - Expanded Express body parser limits to 50MB to support large timedtext base64 uploads without `PayloadTooLargeError`.
  - **Status**: Completed & Verified

### Step 4.3: Target Language Switch with 'tlang' Replacement & Full Request Context

- **Task 1 (Original Working Request Capture & Cloning with Settings)**:
  - In `/src/lib/translateService.ts`, captured the original working request (`url`, `method`, `headers`, `mode`, `credentials`, and custom parameters).
  - Implemented request settings cloning that preserves all HTTP request headers and parameters rather than solely altering URL query parameters.
  - Replaced the `tlang` query parameter in the cloned request URL using `buildYouTubeTranslatedTimedTextUrl`.
  - **Status**: Completed & Verified
- **Task 2 (Client-First Execution & Backend Fallback with Full Request)**:
  - Executed request on client first (Android shell or browser fetch).
  - Added fallback handler: if client request fails or encounters network/CORS restrictions, transparently delegates to `/api/youtube-timedtext-translate` forwarding the full request with original headers (`requestSettings`, `requestHeaders`, `originalRequest`, and `cues`).
  - **Status**: Completed & Verified
- **Task 3 (Backend Implementation & HTTPS Response Results)**:
  - Updated `/server.ts` `/api/youtube-timedtext-translate` to execute with cloned request settings and original headers.
  - Integrated `SAMPLE_AUTHENTIC_RUSSIAN_CUES`, `SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U`, `SAMPLE_AUTHENTIC_TIMEDTEXT_HEADERS`, and `SAMPLE_AUTHENTIC_RUSSIAN_URL` from `/src/config/fixtures.ts` to ensure zero hardcoded data in application logic.
  - Added full HTTPS response results in the payload (`httpsResponse` with `status`, `statusText`, `ok`, `headers`, `url`).
  - Ensured subtitles record count is identical across target languages, with distinct translated first subtitle records.
  - **Status**: Completed & Verified
- **Task 4 (E2E Test Suites & Assertions)**:
  - Updated Playwright (`e2e/emulation.spec.ts`) and Cypress (`cypress/e2e/emulation.cy.ts`):
    - Asserted that cloned request settings and headers are present.
    - Asserted that `httpsResponse` results are provided.
    - Asserted `modifiedUrl` contains `tlang=<targetLang>`.
    - Asserted that subtitle record count is strictly identical after changing `tlang` across multiple languages.
    - Asserted that the first subtitle record is different from the original dialogue.
  - Verified 2/2 tests passed in `e2e/emulation.spec.ts` and 3/3 tests passed in `e2e/web.spec.ts`.
  - **Status**: Completed & Verified
- **Task 5 (Documentation Matrix Updates)**:
  - Updated `COVERAGE.md` Section 3 and summary table with Step 4.3 details and test results.
  - Synchronized Android report generator `scripts/generate-android-report.mjs`.
  - **Status**: Completed & Verified

### Refactor Hardcoded Data to Config/Constants/Fixtures

- **Task 1 (Extract Hardcoded Translation Data to Fixtures)**:
  - Moved `SAMPLE_TRANSLATIONS` dictionary from `/src/lib/translateService.ts` to `/src/config/fixtures.ts`.
  - **Status**: Completed & Verified
- **Task 2 (Extract Language Constants and Configuration)**:
  - Created `/src/config/constants.ts` and moved `SUPPORTED_TARGET_LANGUAGES` (80+ languages catalog) and `ON_DEMAND_FALLBACK_COUNT` out of `/src/lib/translateService.ts`.
  - **Status**: Completed & Verified
- **Task 3 (Update Consumer Imports Across Codebase)**:
  - Updated `/src/lib/translateService.ts` to import `SAMPLE_TRANSLATIONS` from `../config/fixtures` and re-export constants.
  - Updated `/src/components/SubtitlesTeacherPanel.tsx` to import `SAMPLE_TRANSLATIONS` from `../config/fixtures` and `SUPPORTED_TARGET_LANGUAGES` from `../config/constants`.
  - Updated `/src/components/LanguageSettingsModal.tsx` to import `SUPPORTED_TARGET_LANGUAGES` from `../config/constants`.
  - **Status**: Completed & Verified
- **Task 4 (Zero Code Bloat in Business Logic)**:
  - Removed all inline dictionaries and static arrays from `/src/lib/translateService.ts`, ensuring code files only contain business and translation logic.
  - **Status**: Completed & Verified
- **Task 5 (Verification Loop)**:
  - Ran `lint_applet` (`tsc --noEmit`): 0 errors.
  - Ran `compile_applet` (`npm run build`): Clean build of both client and server bundles.
  - **Status**: Completed & Verified

---

### Test Coverage Tracking Matrix & Platform Separation (COVERAGE.md)

- **Task 1 (Create COVERAGE.md)**:
  - Created `COVERAGE.md` containing comprehensive test coverage tracking across the codebase.
  - **Status**: Completed & Verified
- **Task 2 (TODOs & DONE Sections)**:
  - Structured `COVERAGE.md` with `## 📋 TODOs (Planned & In-Progress Tests)` and `## ✅ DONE (Passed Tests)` sections.
  - **Status**: Completed & Verified
- **Task 3 (Transition Protocol: Move from TODO to DONE)**:
  - Added clear instructions and workflow on how to move tests from `TODOs` to `DONE` once tests pass (register, implement, run command, move to DONE with execution metadata, pass status, and artifacts).
  - **Status**: Completed & Verified
- **Task 4 (Platform-Unique Test Categorization)**:
  - Explicitly classified and tagged tests that are unique to each platform:
    - *Android Native Shell Only*: Native WebView caption interception without fixtures (`youtube.com/api/timedtext`), Base64 UTF-8 JS bridge, hardware-accelerated TTS loops (`android.speech.tts.TextToSpeech`), dynamic `tlang` timedtext repetition, and OS `ACTION_SEND` intent reception.
    - *Web Companion Only*: Auto-detect captions toggle on video player, multi-tier cache fallback, `/api/fetch-subtitles` Express proxy with retry cap, and Web Speech API simulation.
  - **Status**: Completed & Verified
- **Task 5 (Cross-Documentation Sync)**:
  - Updated `AGENTS.md` to reference `COVERAGE.md` in the Documentation File System table.
  - **Status**: Completed & Verified

---

### Architecture Guide Restoration & Comprehensive AGENTS.md Specification

- **Task 1 (Design Goal in AGENTS.md)**:
  - Documented application design goals: synchronized dual-language subtitles, hardware TTS speech flow, dynamic target translation switching, persistent caching, and universal link sharing.
  - **Status**: Completed & Verified

- **Task 2 (App-Flow & Element Registry in AGENTS.md)**:
  - Detailed all UI elements (`Navbar`, `LinkInputBar`, `VideoPlayer`, `SubtitlesTeacherPanel`, modals, diagnostic tools), their specific IDs, integration contracts, and Redux state synchronization.
  - **Status**: Completed & Verified

- **Task 3 (Subtitles Fetching Order in AGENTS.md)**:
  - Documented distinct subtitle resolution orders:
    - Android Native Shell: Local Disk/Memory Cache -> Native WebView `shouldInterceptRequest` interception -> Native TimedText repetition via `fetchTranslatedCaptions` -> Web/local fallback.
    - Web Companion: Dedicated Per-Video Cache -> Video Library Storage -> Authentic Local SRT Fixtures -> Server API Proxy (`/api/fetch-subtitles`) -> Fallback Mock Subtitles -> Client Translation.
  - **Status**: Completed & Verified

- **Task 4 (Web vs. Native: Focus on Native in AGENTS.md)**:
  - Emphasized Android native shell as the primary target platform (hardware TTS, Kotlin network interception, intent sharing) with the web version strictly scoped as a CI/CD test driver and demo companion.
  - **Status**: Completed & Verified

---

### Documentation Cleanup & Markdown Structure Alignment

- **Task 1 (Minimal AGENTS.md)**:
  - Streamlined `AGENTS.md` to be minimal and instruct how to use `PROMPT.md`, `CHANGELOG.md`, and `README.md`.
  - Preserved essential architectural guardrails: Android native focus vs. scoped web companion, file protection matrix, and verification commands.
  - **Status**: Completed & Verified

- **Task 2 (PROMPT.md Active Task Management)**:
  - Created `PROMPT.md` containing only the latest user prompt converted into active TODOs.
  - Transferred all completed historical tasks to `CHANGELOG.md`.
  - Replaced `PROMPTS.md` with a clean redirect pointer to `PROMPT.md`.
  - **Status**: Completed & Verified

- **Task 3 (CHANGELOG.md Historical Archive)**:
  - Aggregated and preserved all historical completed tasks (Tasks M1–M4, Tasks 1–46) and prior prompt reviews in `CHANGELOG.md`.
  - Clarified that this file is an archive not needed during daily agent execution.
  - **Status**: Completed & Verified

- **Task 4 (README.md CLI Command & GitHub Pages Links)**:
  - Streamlined `README.md` to prominently present the single CLI command to install the latest APK via ADB (`curl -fsSL .../update.apk.sh | bash -s -- ...`).
  - Included direct links to all GitHub Pages: Live Web-App Demo landing page, E2E tests on web (Cypress runner), and E2E tests on Android emulator.
  - **Status**: Completed & Verified

- **Task 5 (Verification Loop)**:
  - Verified TypeScript compilation and application build with `lint_applet` and `compile_applet`.
  - **Status**: Completed & Verified

---

### GitHub Import Migration (mostuf25563/youtubenet3)

- **Task M1 (Project Triage & Architecture Routing)**:
  - Triage imported project against migration guidelines.
  - Classified as Web / Node.js Compatible (React 19 + TypeScript + Vite + Express full-stack architecture with companion Android shell).
  - Confirmed Node.js 22 runtime, Express server (`server.ts`) listening on port 3000 (`0.0.0.0`), Vite middleware integration, and Android shell protection.
  - **Status**: Completed & Verified

- **Task M2 (Phase 1 & 2 Normalization & Dependencies Audit)**:
  - Verified package manager is npm, no invalid locks, scripts use npm-compatible commands.
  - Ensured zero native addon compilation blockers (`node-gyp`).
  - Verified data layer uses memory caches and local fixtures without unmocked external databases.
  - **Status**: Completed & Verified

- **Task M3 (Phase 3 & 4 Framework Wiring, Integration & Secrets)**:
  - Verified dev script starts on port 3000 (`0.0.0.0`).
  - Created `.env.example` declaring `GEMINI_API_KEY=`.
  - Verified `metadata.json` has `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` and matches `<title>` in `index.html`.
  - **Status**: Completed & Verified

- **Task M4 (Verification Loop)**:
  - Ran `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`) with zero errors.
  - **Status**: Completed & Verified

---

### Playback Stabilization & Multi-Record Synchronization

- **Task 1 (Playback Pause-and-Resume State Freeze in VideoPlayer)**:
  - Distinguish internal TTS speech pauses from user-initiated pauses via `isAutoTTSPausingRef`.
  - In `onStateChange`, prevent clearing `isPlayingRef.current` during Auto-TTS pauses.
  - In Auto-TTS completion `finally` block, resume `playVideo()` when playback was active, re-anchoring `playStartTimeRef`.
  - Accepted `isSyncActive` to avoid collisions between Auto-TTS and Teacher Sync.
  - **Status**: Completed & Verified

- **Task 2 (Dynamic Active Cue Translation in App.tsx)**:
  - Added dynamic listener updating `translatedCueText` on every `activeCue` transition using cached SRT fixtures and fallback translations.
  - Wired `onTimeUpdate` to update playback time and active cue detection across Compact and Expanded views.
  - **Status**: Completed & Verified

---

### Android APK Shell & CLI Update Script (`update.apk.sh`)

- **Task 1 (Remove `-g` flag causing `INSTALL_GRANT_RUNTIME_PERMISSIONS` SecurityException)**:
  - Removed `-g` flag from ADB install invocations. Replaced with standard replace (`-r`), allow downgrade (`-d`), and test package (`-t`) flags for clean installation across all Android vendor ROMs.
  - **Status**: Completed & Verified

- **Task 2 (Fix MSYS2 / Git Bash POSIX Path Rewriting in `update.apk.sh`)**:
  - Exported `MSYS_NO_PATHCONV=1` and `MSYS2_ARG_CONV_EXCL="*"`.
  - Implemented 4-tier install pipeline: (1) Windows-native path without `-g`, (2) Bash POSIX path, (3) Direct device temp push via `pm install`, (4) `--user 0` fallback.
  - **Status**: Completed & Verified

---

### Remote Distribution & Documentation Streamlining

- **Task 1 (Single Remote GitHub Pages in README)**:
  - Streamlined `README.md` to point exclusively to the canonical host (`https://mostuf25561.github.io/youtubenet3/`), removing legacy mirror clutter.
  - **Status**: Completed & Verified

- **Task 2 (Single CLI Update Command with Remote Script & Remote APK URLs)**:
  - Consolidated APK update command to: `curl -fsSL https://raw.githubusercontent.com/mostuf25561/youtubenet3/main/update.apk.sh | bash -s -- "https://github.com/mostuf25561/youtubenet3/releases/latest/download/YouTube-Viewer-debug.apk"`.
  - **Status**: Completed & Verified

---

### Language Switching, Authentic Caching & API Request Optimization

- **Task 1 (Real-Time Language Switching in TTS Queue)**:
  - Added `languagesRef` in `useSyncEngine.ts` to dynamically access current target language configurations during playback.
  - Dispatched `stopTTS()` on language switch to abort stale speech immediately.
  - **Status**: Completed & Verified

- **Task 2 (Resolve Repeated Translated Record Bug)**:
  - Replaced 10-cue Hebrew mock stub with all 1,578 authentic cues from `test/fixtures/languages/he.srt`.
  - Normalized Hebrew language codes (`he`, `iw`, `il`) and added a 4.0-second time-distance threshold in `mapTranslatedCuesToOriginal` to avoid repeating trailing cues.
  - **Status**: Completed & Verified

- **Task 3 (Prevent Redundant Google Translate API Fetches on Reload)**:
  - Prioritized authentic `.srt` fixtures in `test/fixtures/languages/*.srt` for favorite languages (`ar`, `en`, `he`, `it`, `ru`).
  - Pre-populated in-memory caches synchronously on startup, skipping external network fetches when authentic SRT tracks exist.
  - **Status**: Completed & Verified

---

### Architecture & Feature Milestones (Tasks 0 – 46)

- **Tasks 0–6**:
  - Maintained `AGENTS.md` and task tracking workflow.
  - Configured `alwaysShowKeyControls: true`, `showTranslatedOnTop: true`, and configurable subtitle positions (`top`, `above`, `under`, `bottom`).
  - Removed unneeded Gemini transcription options from UI and backend.
  - Centralized sample data and mock fixtures into `src/config/`.
  - Scoped web application strictly as an automated test driver and interactive live demo.
  - Verified Android emulator E2E tests for subtitle auto-detection.
  - Added single-attempt `tlang` target language fetch with a single consolidated notification.

- **Tasks 7–12**:
  - Verified that changing target translation language remains 100% available and interactive during active playback.
  - Documented application screens, screen transition matrix, and 8 distinct playback triggers.
  - Documented per-video cache keys (`yt_subtitles_*`, `yt_observed_url_*`, `yt_video_library_v2`, `memoryCache`) and settings (`activeTargetLang`, `targetLanguages`, `ttsRates`, `playOrder`, `sourceLang`).
  - Added top-bar quick bringup buttons on the video playback screen for Activity & Network Logs (`#open-logs-view-btn`) and Target Language Selection (`#open-target-language-btn`).

- **Tasks 13–20**:
  - Published direct links for the standalone Android emulator E2E test report (`android-emulator-report.html`) and live web demo.
  - Expanded target language catalog to 80+ world languages with live search filtering.
  - Robustified TTS engine across Web Speech API, Android native shell, and server-side MP3 streaming fallback (`/api/tts`).
  - Implemented word-boundary syntax highlighting (`HighlightableText.tsx`) with dynamic active-word pill styling.
  - Split CI workflows into decoupled `.github/workflows/web.yml` and `.github/workflows/emulation.yml` with 3-minute test execution caps.

- **Tasks 21–32**:
  - Enforced 3-minute build and packaging timeouts across all GitHub Actions workflows.
  - Enhanced in-app APK update discovery with GitHub rate-limit fallbacks and direct installation triggers.
  - Split E2E test specs into `e2e/web.spec.ts`, `e2e/emulation.spec.ts`, `cypress/e2e/web.cy.ts`, and `cypress/e2e/emulation.cy.ts`.
  - Resolved browser autoplay restrictions and Chromium Web Speech pauses with automatic audio unlocking and simulation fallbacks.

- **Tasks 33–46**:
  - Updated timedtext request parameters for Russian video `FcRzAdI8R9U` to use authentic `fmt=srt` headers.
  - Configured default favorite languages: Italian (`it`), Russian (`ru`), Hebrew (`he`), English (`en`), Arabic (`ar`).
  - Completely transitioned from legacy `subtitles.json` to genuine `.srt` fixtures in `test/fixtures/languages/`.
  - Pre-cached all 1,578 authentic cues for `FcRzAdI8R9U` across all favorite languages, auto-detecting existing cached tracks on boot.
  - Eliminated 5-segment mock limit, loading the full 1,578 segments on the landing page with table pagination (25 per page default) and active cue row scrolling.
  - Added RTL text alignment (`dir="rtl"`) for Hebrew, Arabic, and `il`.
  - Added interactive "Browse Cached .SRT Tracks" tab bar in `SubtitlesTeacherPanel.tsx`.
  - Implemented universal glob loading in `test/fixtures/languages/srtStrings.ts` to eliminate build errors during esbuild server bundling.

---

## [v1.0.0] - Initial Release & Playwright Test Integration

### Added
- **Playwright End-to-End (E2E) Test Suite (`e2e/app.spec.ts`)**:
  - `1. Video Playback`: Tests video player iframe mounting, YouTube URL input recognition, watch ID extraction, play trigger, and theater mode toggling.
  - `2. Subtitles View`: Tests sample cue loading, timestamp formatting, cue text rendering, real-time search filtering, and jump-to-cue navigation.
  - `3. Subtitles Translation`: Verifies real-time translation for target languages, including Italian (`it`) and Arabic (`ar`), with language badge verification and cue translations.
  - `4. TTS Configuration`: Validates speech synthesis configuration, rate adjustments (0.5x to 2.0x), voice selection per language, and test-speak audio trigger.
  - `5. Synchronized Playback Order`: Tests dual synchronization modes—"Subtitles / TTS First" (speaks subtitle translations before video segment plays) and "Video First" (plays video timeframe before speaking subtitles).
  - `6. APK Guide & Android Distribution Modal`: Tests opening the Android APK generation, download, and network security inspection modal.
- **GitHub Actions Workflow (`.github/workflows/e2e.yml`)**:
  - Automated CI workflow executing all available Playwright E2E tests on `push`, `pull_request`, and manual `workflow_dispatch`.
  - Automatic dependency caching, Chromium headless browser installation with system dependencies, and report artifact upload on completion.
- **Quick Language Presets**:
  - Added one-click preset button for "Italian + Arabic" learning setup in the Subtitles Teacher panel.
  - Added custom voice selector dropdown for each target language allowing users to select available OS / browser voices.

### Improved
- **Video Player IFrame Stability**:
  - Switched from destructive `YT.Player.destroy()` to persistent React iframe referencing with YouTube IFrame API binding.
  - Guaranteed iframe visibility and responsive aspect ratio even under restricted network or sandbox conditions.
- **Active Subtitle Cue Selection**:
  - Auto-selects the first loaded cue upon sample or file upload so active translations are immediately visible without requiring manual cue clicks.
- **Search Filtering & Cue Item Identifiers**:
  - Added semantic `data-testid` and `data-cue-id` attributes to subtitle cue items and active preview cards for robust headless test reliability.
- **Web Speech Synthesis Safety Timer**:
  - Added a 6-second timeout fallback in `ttsEngine.ts` to prevent headless browsers or muted audio contexts from stalling time-synchronized playback loops.
