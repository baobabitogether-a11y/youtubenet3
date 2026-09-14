# Changelog

All notable changes and completed historical tasks for the YouTube Video Viewer & Subtitles Teacher application are documented in this file.

> **Note for AI Agents**: This file contains historical records of completed tasks and is not required for daily agent execution. Current active tasks are tracked in `PROMPT.md`.

---

## Historical Completed Tasks Archive

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
