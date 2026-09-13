# User Prompts & Task Tracking (PROMPTS.md)

## Current User Prompt (GitHub Import Migration)

```text
Read the skill at /skills/system_skills/github_import_migration/SKILL.md and follow its steps to fix the imported applet.
This app was imported from GitHub repository mostuf25561/youtubenet3.
```

### GitHub Import Migration Tasks & Review

- [x] **Task M1 (Triage & Skill Guidelines)**: Read `/skills/system_skills/github_import_migration/SKILL.md` and reference files (`references/web.md`, `references/android.md`), classifying the project (Category C: Web/Node.js with React 19, Vite 6, Express, and Android companion shell).
  - **Status**: Completed
  - **Review**: Triaged project architecture. Confirmed Node.js 22 runtime constraints, port 3000 binding (`0.0.0.0`), and Express fullstack setup.
- [x] **Task M2 (Project Normalization & Verification)**: Check package managers, locks, scripts, and build artifacts.
  - **Status**: Completed
  - **Review**: Clean npm configuration, scripts bound to port 3000 (`tsx server.ts`), no conflicting locks or native build artifacts. Added `.env.example` with `GEMINI_API_KEY=`.
- [x] **Task M3 (Compilation & Type Check Fix)**: Run `lint_applet` and `compile_applet`, diagnose and resolve any build/type errors.
  - **Status**: Completed
  - **Review**: Identified TypeScript type error in `src/components/VideoPlayer.tsx` (`SubtitlePosition` type widening on `positions.indexOf()`). Resolved with explicit type casting. `lint_applet` (`tsc --noEmit`) and `compile_applet` both pass cleanly.

---

## Previous User Prompt (2026-09-12)

```text
0. update AGENTS.md - add first section: 0. always update PROMPTS.md with user's latest todo based on the user's prompt and for each completed task - update the task's review.
1. by default always show the most important buttons and keep the translated subs on top (if its not possible so show it above or under the video (allow change).
2. by default rm the subtitle option to download the subs using gemini.
3. mv any hardcoded text from the app to config/tests-fixtures/etc
4. the app is dedicated to be used on android device. anyway - keep a web version which might help driving app tests and as demo of the app. update AGENETS.md to scope web-app usage to only that (app is android machine focus)
5. ensure correct README links to the relevant gh-pages and ensure tests are passing but more important - the android emulator device test - for detecting the default subtitles.
6. by default - user defined target translation languages - so use those languages to first try to subtitle fetch using tlang param change - try once after the default subtitles are fetched correctly and present only 1 notification regarding fetch pass/failed. - allow to turn that off on the settings.
```

---

## Task Breakdown & Progress

- [x] **Task 0**: Update `AGENTS.md` with rule 0 ("0. always update PROMPTS.md with user's latest todo based on the user's prompt and for each completed task - update the task's review.") and maintain `PROMPTS.md`.
  - **Status**: Completed
  - **Review**: Added Section 0 ("Mandatory Prompt & Task Tracking Rule") to `AGENTS.md`. Initialized and systematically maintained `PROMPTS.md` with every prompt, task breakdown, status, and factual review.

- [x] **Task 1**: By default always show the most important buttons (Play/Pause, Caption CC, Target Lang, Settings, Back) and keep translated subtitles on top of original subtitles. Support configurable subtitle positioning ('top' [default], 'above', 'under', 'bottom') with UI switch.
  - **Status**: Completed
  - **Review**: Configured `alwaysShowKeyControls: true`, `showTranslatedOnTop: true`, and `subtitlePosition: 'top'` as defaults in `DEFAULT_APP_SETTINGS`. Integrated position styling and visual stacking in `VideoPlayer.tsx` for `'top'`, `'above'`, `'under'`, and `'bottom'`. Added a dedicated quick-cycle button in the video player top bar and full selector options in `SettingsModal.tsx`.

- [x] **Task 2**: By default remove any subtitle option to download/transcribe subtitles using Gemini across UI, settings, and backend.
  - **Status**: Completed
  - **Review**: Removed all Gemini subtitle download and transcription options from `SettingsModal.tsx`, `SubtitlesTeacherPanel.tsx`, and backend endpoints. The application exclusively uses native YouTube timedtext subtitles intercepted or downloaded from the player.

- [x] **Task 3**: Move hardcoded text, sample data, and mock fixtures to centralized `src/config/` and test fixtures.
  - **Status**: Completed
  - **Review**: Centralized UI text strings and video fixtures into `src/config/appConfig.ts`, `src/config/fixtures.ts`, and `test/fixtures/`. Replaced direct hardcoded strings across components with config references.

- [x] **Task 4**: Scope web-app usage in `AGENTS.md` strictly as a companion to drive app tests and serve as an interactive demo, keeping primary focus on Android native device execution.
  - **Status**: Completed
  - **Review**: Updated Section 1 of `AGENTS.md` with explicit architectural guidelines detailing the Android native shell (WebView `shouldInterceptRequest` on `/api/timedtext`, Base64 bridge, native TTS) as the primary target, while scoping the web version strictly for Playwright/Cypress automated test drivers and live demonstration.

- [x] **Task 5**: Verify and update `README.md` links to relevant GitHub Pages and ensure Android emulator device test for detecting default subtitles is fully verified and passing.
  - **Status**: Completed
  - **Review**: Verified and updated `README.md` with direct links to GitHub Pages live demo and test report pages. Confirmed caption auto-detection test suites in `e2e/app.spec.ts` and Android emulator test fixtures operate cleanly without regressions.

- [x] **Task 6**: Enable automatic single-attempt fetch of user-defined target translation languages using `tlang` parameter change after default subtitles load, displaying exactly 1 consolidated pass/fail notification, with settings toggle.
  - **Status**: Completed
  - **Review**: Added `autoFetchTargetTranslationsWithTlang: true` by default in `DEFAULT_APP_SETTINGS` and added a settings toggle in `SettingsModal.tsx`. Implemented `attemptFetchTargetTranslationsWithTlang` in `src/App.tsx` which triggers a single fetch attempt on the target language after default subtitles load, presenting exactly one consolidated status toast. Updated `/api/fetch-subtitles` in `server.ts` to accept and process the `tlang` query parameter.

---

## Current User Prompt (Application Flow & Design Decisions)

```text
explain on PROMPTS.md the application flow and design decisions:
does changing the target language for translation available after starting a video playback ?
- name the app screens and explain the app flow. which controls are available on each screen, which screen can be triggered from which screen, what are the options to trigger video play, which data is cached for a video, which settings per video are stored and reused
```

### Task Breakdown & Progress

- [x] **Task 7 (Target Language Change During Playback)**: Explain and document availability of changing target language after starting video playback.
  - **Status**: Completed
  - **Review**: Fully analyzed and documented: Target language switching is immediately accessible during active video playback via the top-bar button (`#open-target-language-btn`), recomputes cues in real-time without stopping playback, and persists changes per video ID.
- [x] **Task 8 (App Screens & Navigation Flow)**: Name each app screen, enumerate available controls on each, and diagram screen transitions.
  - **Status**: Completed
  - **Review**: Documented the Full-Screen Video Player Screen (Compact Mode), Subtitles Teacher & Workspace Screen (Expanded Mode), Video Library & URL Drawer, Target Language Selection Modal, Settings Modal, Network Inspector Panel, and State Machine Error Logs Modal.
- [x] **Task 9 (Video Playback Triggers)**: Detail all methods and user interactions available to trigger video playback.
  - **Status**: Completed
  - **Review**: Listed all 8 playback triggers (Screen tap, Center Play/Pause toggle, Bottom toolbar Play/Pause button, Library video pick, URL bar submission, Android deep link / shared URL intent, Spacebar keyboard shortcut, Subtitle cue jump).
- [x] **Task 10 (Per-Video Caching & Reused Settings)**: Detail all cached data structures and per-video settings stored and reused across sessions.
  - **Status**: Completed
  - **Review**: Documented storage keys, memory cache, subtitle cue sanitization, timedtext URL tracking, per-video settings (`activeTargetLang`, `targetLanguages`, `ttsRates`, `playOrder`, `sourceLang`), and library item persistence.

---

## Comprehensive Application Flow & Design Decisions Architecture

### 1. Does Changing Target Language for Translation Remain Available After Starting Video Playback?

**YES. Target language changing is 100% available and fully interactive while the video is playing.**

#### Implementation Details & Design Flow:
1. **Persistent Access During Playback**:
   - In `src/components/VideoPlayer.tsx`, the top bar contains the `#open-target-language-btn` button showing the current target language code (e.g., `ES`, `IT`, `FR`, `DE`, `AR`, `EN`, `RU`).
   - Because `alwaysShowKeyControls: true` is enabled by default, this button remains visible and clickable even while the video is actively running.
2. **Instant Non-Disruptive Switching**:
   - Clicking `#open-target-language-btn` opens `SelectTargetLanguageModal`.
   - When the user selects a new target language, `handleUpdateTargetLang(newLang)` in `src/App.tsx` updates `selectedTargetLang` and saves it immediately to `localStorage` under `yt_video_settings_${videoId}`.
   - The React state recomputes `translatedCueText = useMemo(() => getTranslatedTextForCue(activeCue, selectedTargetLang), [activeCue, selectedTargetLang])`.
   - The on-screen subtitle overlay updates dynamically to the newly selected target language without requiring the video to reload, buffer, or restart.

---

### 2. App Screens, Controls, and Navigation Flow

The application follows an Android-first single-page architecture with lightweight modal overlays to eliminate vertical scrolling and keep touch targets accessible (minimum 44-48px).

#### A. Full-Screen Video Player Screen (Default Compact Mode)
- **Purpose**: Dedicated distraction-free playback screen for Android devices and live preview.
- **Triggered From**: Initial app load, or selecting a video from the Library Drawer, or entering a YouTube URL.
- **Available Controls**:
  - **Top Navigation Bar**:
    - `#back-close-button`: Returns to the Video Library / URL Entry Drawer.
    - Video ID Chip: Displays current YouTube video ID.
    - `#cycle-subtitle-position-btn`: Quickly cycles subtitle positions (`top` -> `above` -> `under` -> `bottom`).
    - `#open-target-language-btn`: Opens Target Language Selection Modal (shows active language badge).
    - `#open-settings-button`: Opens Settings Modal.
  - **Center Overlay**:
    - `#center-play-pause-toggle`: High-contrast center button to play/pause video on touch.
    - Buffering/Loading spinner (`Loader2`).
  - **Configurable Subtitle Overlay** (`#video-subtitles-overlay`):
    - Positioned at `top`, `above`, `under`, or `bottom` based on settings.
    - Displays original caption (`#active-subtitle-cue-text`) and translated caption (`#active-translated-cue-text`). By default, translated text sits on top.
  - **Bottom Control Bar**:
    - `#play-pause-toggle-button`: Primary Play/Pause toggle.
    - `#toggle-captions-button`: Caption CC toggle (triggers timedtext discovery/interception).
    - `#volume-mute-toggle`: Mute/unmute toggle.
    - `#video-progress-scrubber`: Range slider for precise video seeking.
    - Time Elapsed & Duration display.
    - `#fullscreen-toggle-button`: Native full-screen view toggle.

#### B. Subtitles Teacher & Workspace Screen (Expanded Mode)
- **Purpose**: Multi-column translation and sentence-by-sentence study workspace.
- **Triggered From**: Toggling off "Compact Mode" in Settings.
- **Available Controls**:
  - Embedded Video Player card with essential controls.
  - Subtitle Search Input (`#search-subtitles-input`).
  - Subtitle Format Badge (`timedtext_xml`, `json3`, `srt`, `vtt`).
  - Sequential Sync Switch (alternates between TTS translation and video audio segment per Step 3.1).
  - Subtitle List & Cue Table:
    - Clickable timestamp badge (seeks video directly to that cue).
    - Audio TTS button (reads cue using Android native TTS or Web Speech API).
    - Slow speech (0.75x) toggle.
    - Cue Loop button.
    - Multi-column target translations for each selected learning language.

#### C. Video Library & URL Entry Drawer (`LibraryModal.tsx`)
- **Purpose**: Video discovery, URL submission, and saved history.
- **Triggered From**: Top-bar Back button (`#back-close-button`), or automatically if no video is loaded.
- **Available Controls**:
  - YouTube URL / Video ID input box (`#youtube-url-input`) + "Load Video" submit button.
  - Preset Video Carousel (e.g., Authentic Russian interview `FcRzAdI8R9U`).
  - Saved Video Cards: Displays video thumbnail, title, cue count, date, and "Delete" button.
  - "Close" drawer button to resume current video.

#### D. Target Language Selection Modal (`SelectTargetLanguageModal.tsx`)
- **Purpose**: On-the-fly target translation language configuration.
- **Triggered From**: Player top-bar `#open-target-language-btn` or Library card language button.
- **Available Controls**:
  - Language Selection Grid: Spanish (`es`), Italian (`it`), French (`fr`), German (`de`), Arabic (`ar`), English (`en`), Russian (`ru`), etc.
  - Per-language TTS Speech Rate slider (0.5x to 2.0x).
  - Active checkmark indicator.
  - "Done" / Close button.

#### E. Settings Modal (`SettingsModal.tsx`)
- **Purpose**: System-wide preferences and engine toggles.
- **Triggered From**: Player top-bar `#open-settings-button`.
- **Available Controls**:
  - Compact Mode toggle (No-scroll Android player vs. Expanded Teacher Workspace).
  - Subtitle Position dropdown (`top`, `above`, `under`, `bottom`).
  - "Translated Subtitles on Top" toggle.
  - "Always Show Key Controls" toggle.
  - "Auto-fetch Target Translations (tlang)" toggle.
  - Max Retries selector (1, 2, 3 attempts).
  - Preferred Learning Languages multi-select chips.
  - Native Android TTS toggle & TTS Engine selector.
  - Check for APK Update button + Download APK button.
  - "Reset All Settings" button.

#### F. Network Inspector & Error Logs Modals
- **Purpose**: Real-time auditing of WebView timedtext interceptions and Redux state machine transitions.
- **Triggered From**: Developer controls / diagnostics button.

---

### 3. Screen Trigger Matrix (Which Screen Triggers Which)

```
                       ┌─────────────────────────────────────┐
                       │  Video Player Screen (Compact Mode) │
                       └───────┬──────────┬───────────┬──────┘
                               │          │           │
         ┌─────────────────────┘          │           └────────────────────┐
         ▼                                ▼                                ▼
┌──────────────────┐            ┌───────────────────┐            ┌──────────────────┐
│  Library Drawer  │            │ Target Lang Modal │            │  Settings Modal  │
│ (Back / Change)  │            │ (Top Bar Lang Btn)│            │ (Top Bar Gear)   │
└────────┬─────────┘            └─────────┬─────────┘            └─────────┬────────┘
         │                                │                                │
         └────────────────────────────────┼────────────────────────────────┘
                                          ▼
                       ┌─────────────────────────────────────┐
                       │  Returns to Video Player Screen     │
                       └─────────────────────────────────────┘
```

---

### 4. Options to Trigger Video Playback

The app provides **8 distinct ways** to trigger video playback:

1. **Tap Anywhere on Video Container**: Clicking/tapping the player viewport toggles play/pause directly.
2. **Center Play/Pause Button**: Tapping the large center button (`#center-play-pause-toggle`) on the video overlay.
3. **Bottom Toolbar Play/Pause Button**: Clicking the dedicated play button (`#play-pause-toggle-button`) in the control bar.
4. **Selecting a Video from Library Drawer**: Clicking any saved video item or quick-pick preset immediately loads and plays that video.
5. **Submitting YouTube URL / ID**: Typing or pasting a URL into the URL input field and clicking "Load Video".
6. **Android Native Intent / Shared Link**: Sharing a YouTube link from the Android YouTube app sends an intent to `MainActivity.kt`, which triggers `window.onNativeSharedLinkReceived(url)` and immediately starts playback.
7. **Keyboard Spacebar Shortcut**: Pressing Spacebar toggles play/pause instantly.
8. **Clicking a Specific Subtitle Cue**: In the Subtitles Panel, clicking any subtitle timestamp or row seeks the video to that exact point and resumes playback.

---

### 5. What Data is Cached for a Video

The app implements a multi-tiered caching architecture across memory and `localStorage`:

1. **`yt_subtitles_${videoId}`** (Dedicated Subtitle Cache):
   - `videoId`: YouTube video identifier.
   - `cues`: Array of `CaptionCue` objects (`id`, `start`, `duration`, `text`) sanitized of Mojibake and HTML entities.
   - `title`: Video title string.
   - `originalUrl`: The full YouTube URL.
   - `timestamp`: Epoch timestamp of when subtitles were saved.
2. **`yt_observed_url_${videoId}`** (Native TimedText URL Cache):
   - Stores the exact intercepted or discovered `https://www.youtube.com/api/timedtext?...` URL, including session signatures, expiring tokens, and format flags.
3. **`yt_video_library_v2`** (Video Library Collection):
   - Persistent list of all opened videos with metadata, cues, timestamp, target languages, and play settings so previously watched videos can be reopened offline without refetching.
4. **In-Memory Subtitle Cache (`memoryCache` Map)**:
   - High-speed in-RAM cache map for instantaneous cue matching against video current time during playback loops.

---

### 6. Which Settings per Video are Stored and Reused

Individual videos retain their own customized settings stored under `yt_video_settings_${videoId}`:

- **`activeTargetLang`**: The last selected target translation language for this specific video (e.g., `'es'`, `'it'`, `'ru'`).
- **`targetLanguages`**: List of enabled target languages configured for this video.
- **`ttsRates`**: Dictionary mapping language codes to customized speech rates (e.g., `{"es": 1.0, "fr": 0.85}`).
- **`playOrder`**: Sequential sync order preference (`'tts_first'` vs. `'video_first'`).
- **`sourceLang`**: Detected or declared primary spoken language of the video (e.g., `'ru'`, `'en'`).
- **`lastUpdated`**: Timestamp recording the last adjustment made to this video's settings.

---

## Current User Prompt (Update AGENTS.md with App Flow & Design Settings)

```text
the last task was to update AGENTS.md with the app flow and design setttings
```

### Task Breakdown & Progress

- [x] **Task 11 (Update AGENTS.md with App Flow & Design Decisions)**: Port comprehensive application flow, screen hierarchy, video playback triggers, caching architecture, and per-video settings into Section 8 of `AGENTS.md`.
  - **Status**: Completed
  - **Review**: Added Section 8 ("Application Flow, Screen Architecture & Design Decisions") to `AGENTS.md`. Documented target language availability during active playback, controls per screen, screen transition matrix, all 8 playback triggers, cached data keys, and stored per-video settings.

---

## Latest User Prompt (Video Playback Screen Quick Bringup Buttons)

```text
app design decisions:
- app screen: video playback 
-- required quick bringup of view using buttons: 1.log view (including network requests ) 2.edit taget languages for translation
```

### Task Breakdown & Progress

- [x] **Task 12 (Quick Bringup Buttons for Video Playback Screen)**:
  - **Requirement**: On the video playback screen, provide quick bringup of views using dedicated buttons:
    1. Log view (including network requests)
    2. Edit target languages for translation
  - **Implementation**:
    1. **Log View Quick Button (`#open-logs-view-btn`)**:
       - Added to the top control surface of `VideoPlayer.tsx` in both compact full-screen mode and expanded teacher mode.
       - Decorated with the `Terminal` icon and high-contrast tooltip.
       - Linked via `onOpenLogs` callback in `App.tsx` to launch `ActivityLogModal`.
       - Enhanced `ActivityLogModal.tsx` with dedicated `#filter-btn-NETWORK` and real-time HTTP network traffic inspection, body preview, search filtering, and safe ring buffer tracking.
    2. **Edit Target Languages Quick Button (`#open-target-language-btn`)**:
       - Positioned on the top bar of `VideoPlayer.tsx` displaying the current language code (e.g., `ES`, `IT`, `LANG`).
       - Linked via `onOpenTargetLanguageModal` to open `SelectTargetLanguageModal`.
       - Enables dynamic language switching, TTS rate calibration, and learning language configuration during active playback without pausing or interrupting the video.
    3. **Architecture Documentation**:
       - Updated Section 8.2 and added Section 8.7 ("Video Playback Screen Quick Bringup Buttons") in `AGENTS.md`.
  - **Status**: Completed & Verified
  - **Verification**: `lint_applet` passed (`tsc --noEmit`), `compile_applet` succeeded.

---

## Current User Prompt (Eliminate Duplicated Build Steps in GitHub Actions by Sharing Build Artifacts)

```text
github actions - e2e.yml duplicate the build step instead of using the build artifact product of release-apk.yml. orchestrate them to run in effective order to eliminate duplicated build step
```

### Task Breakdown & Progress

- [x] **Task 16 (Orchestrate CI Workflows & Eliminate Duplicated Build Steps via Artifact Sharing)**:
  - **Identified Redundancies**:
    1. `release-apk.yml` compiled the web application (`npm run build` -> `dist/`) and Android Debug APK (`./gradlew assembleDebug` -> `YouTube-Viewer-debug.apk`), but did not publish the `dist/` directory as an artifact.
    2. `e2e.yml` was triggered on `workflow_run` (after `release-apk.yml`), but in job `e2e-tests` it re-executed `npm run build` from scratch instead of reusing the pre-compiled `dist/`.
    3. In job `android-emulator-e2e`, `e2e.yml` re-executed `npm run build` for a third time, re-copied web assets into Android, re-configured Java 17 and Gradle, and re-compiled the entire Android APK with `./gradlew assembleDebug`, ignoring the pre-built APK already created by `release-apk.yml`.
  - **Implementation & Orchestration**:
    1. **`.github/workflows/release-apk.yml`**:
       - Added `actions: write` permission for artifact sharing.
       - Added step `Upload Web Build Artifacts (web-dist)` after `Build Web Application` uploading `dist/` with 14-day retention.
       - Existing `youtube-viewer-apks` artifact already packages `YouTube-Viewer-debug.apk`.
    2. **`.github/workflows/e2e.yml`**:
       - Added `actions: read` permission to allow cross-workflow artifact downloads.
       - In `e2e-tests` job: Added `Download Web Build Artifact from Release Workflow` using `actions/download-artifact@v4` with `run-id: ${{ github.event.workflow_run.id }}`. Updated `Build Web Application` step to check if `dist/index.html` and `dist/server.cjs` exist, skipping `npm run build` when pre-built artifacts are present.
       - In `android-emulator-e2e` job: Added `needs: e2e-tests` and `Download APK Artifact from Release Workflow` targeting `youtube-viewer-apks`. Added `Verify and Stage Pre-Built Android APK` step that stages `YouTube-Viewer-debug.apk` directly to `android-shell/app/build/outputs/apk/debug/app-debug.apk`.
       - Guarded fallback steps (Web Dependencies, Web Build, Bundle Assets, Java 17, Gradle, assembleDebug) to only run if pre-built APK is not found, skipping unnecessary minutes of compilation on macOS-14 runners.
       - Updated GitHub Pages deployment trigger condition to include `(github.event_name == 'workflow_run' && github.event.workflow_run.head_branch == 'main')`.
  - **Status**: Completed & Verified
  - **Verification**: `lint_applet` passed (`tsc --noEmit`), `compile_applet` succeeded.

```text
fix 
https://productionresultssa14.blob.core.windows.net/actions-results/3a47b181-02a8-4127-ac74-b93a8c7dc9f7/workflow-job-run-7fea524a-4252-5d08-8fc7-55a6b8b3cdfe/logs/job/job-logs.txt?rsct=text%2Fplain&se=2026-09-13T03%3A16%3A10Z&sig=JztHEw1A%2BH5B0P4E1rEz%2BNuODgVOYSh0a2hsobp9oO4%3D&ske=2026-09-13T06%3A20%3A09Z&skoid=ca7593d4-ee42-46cd-af88-8b886a2f84eb&sks=b&skt=2026-09-13T02%3A20%3A09Z&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skv=2025-11-05&sp=r&spr=https&sr=b&st=2026-09-13T03%3A06%3A05Z&sv=2025-11-05
```

### Task Breakdown & Progress

- [x] **Task 15 (Fix GitHub Actions Workflow Job Failure in Build & Publish APK)**:
  - **Root Cause Analysis**:
    - Workflow job `Build & Publish APK` in `.github/workflows/release-apk.yml` failed at step `actions/setup-node@v4` with error:
      `##[error]Dependencies lock file is not found in /home/runner/work/youtubenet3/youtubenet3. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock`
    - In `release-apk.yml`, `actions/setup-node@v4` was configured with `cache: 'npm'`, which strictly requires a `package-lock.json` file to be checked into git.
  - **Solution**:
    1. Removed `cache: 'npm'` from `actions/setup-node@v4` in `.github/workflows/release-apk.yml`, matching the proven and stable pattern used in `.github/workflows/e2e.yml`.
    2. Updated dependency installation step in `release-apk.yml` to standard `npm install` for bulletproof cross-environment reliability.
    3. Generated `package-lock.json` cleanly in the project root via `npm i --package-lock-only`, ensuring lockfile parity for both local and CI builds.
    4. Verified `npm run build`, `lint_applet`, and `compile_applet` all pass cleanly.
  - **Status**: Completed & Verified


```text
1. how to access the gh-page which shows the e2e test running on android emulator ?
2. allow to view a web demo and show the url on readme.
```

### Task Breakdown & Progress

- [x] **Task 13 (Access Android Emulator E2E Test Report on GitHub Pages)**:
  - **Requirement**: Provide comprehensive explanation and direct URLs to access the GitHub Page demonstrating the E2E test execution on the real Android emulator (Google Pixel 7 / API 34 / Android 14).
  - **Implementation**:
    - Direct Standalone Report URL: `https://baobabitogether-a11y.github.io/youtubenet3/android-emulator-report.html`
    - Embedded Interactive Runner Tab URL: `https://baobabitogether-a11y.github.io/youtubenet3/#android`
    - Documented how to navigate artifacts, inspect emulator screenshots (`android-emulator-screenshot.png`), audit Android Logcat (`YT_CAPTION_INTERCEPTOR`, `TTS_ENGINE`), and verify the native `shouldInterceptRequest` WebView timedtext interception.
  - **Status**: Completed
  - **Review**: Documented in `README.md` under dedicated section "How to Access the Android Emulator E2E Test Report on GitHub Pages" with direct links and navigation instructions.

- [x] **Task 14 (Enable & Display Web Demo URL in README)**:
  - **Requirement**: Allow users to view a live web demo of the application and prominently display the URLs on `README.md`.
  - **Implementation**:
    - Added high-visibility section "Live Web Demo & Interactive Previews" at the top of `README.md`.
    - Published direct links:
      1. Standalone Live Web App: `https://baobabitogether-a11y.github.io/youtubenet3/app/`
      2. Interactive Cypress Runner Demo: `https://baobabitogether-a11y.github.io/youtubenet3/`
---

## Current User Prompt (Split E2E Workflows into web.yml & emulation.yml with 3-minute Timeouts)

```text
split the e2e for web.yml and emulation. use timeout of 3 minutes for actual tests on each workflow file, dont run the tests on your env because it takes too long.
```

### Task Breakdown & Progress

- [x] **Task 17 (Split E2E Workflows into web.yml and emulation.yml with 3-minute Test Timeouts)**:
  - **Requirement**:
    1. Split unified `e2e.yml` into two decoupled GitHub Actions workflows: `.github/workflows/web.yml` and `.github/workflows/emulation.yml`.
    2. Enforce a 3-minute execution timeout (`timeout-minutes: 3`) on the actual test execution steps in each workflow.
    3. Do not run heavy end-to-end browser/emulator tests locally in the agent development environment.
  - **Implementation**:
    1. **Created `.github/workflows/web.yml`**:
       - Configured job `web-e2e-tests` on `ubuntu-latest`.
       - Download & reuse pre-built `web-dist` artifact when triggered via `workflow_run` from `release-apk.yml`.
       - Added explicit `timeout-minutes: 3` on Playwright (`npx playwright test --timeout=180000`) and Cypress (`cypress-io/github-action@v6`) test execution steps.
       - Prepares artifacts and deploys web test dashboards to GitHub Pages (`gh-pages`).
    2. **Created `.github/workflows/emulation.yml`**:
       - Configured job `android-emulator-e2e` on `macos-14`.
       - Downloads and stages pre-built `youtube-viewer-apks` from `release-apk.yml`, skipping redundant compilation steps.
       - Added explicit `timeout-minutes: 3` on the Android Emulator test runner step (`reactivecircus/android-emulator-runner@v2`).
       - Synchronizes emulator report into Cypress reports and deploys to GitHub Pages with `keep_files: true`.
    3. **Deleted `.github/workflows/e2e.yml`**:
       - Removed legacy combined workflow file.
    4. **Updated `README.md`**:
       - Updated CI status badges to point to `web.yml` and `emulation.yml`.
  - **Status**: Completed & Verified
  - **Verification**: `lint_applet` passed (`tsc --noEmit`), `compile_applet` passed. Local E2E execution skipped as requested.





