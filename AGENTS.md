# AGENTS.md — Developer & Coding Agent Guidelines

## 1. Documentation File System

Coding agents must understand and respect the role of each markdown documentation file in this repository:

| File | Purpose & Agent Directive |
| :--- | :--- |
| **`PROMPT.md`** | **Active Agent Worklist**: Contains ONLY the latest user prompt converted into actionable TODOs. Agents must read this file at the start of each task. **All completed tasks MUST be moved to `CHANGELOG.md`**. |
| **`CHANGELOG.md`** | **Historical Archive**: Not of interest to agents during active coding. Holds chronological records of completed tasks, previous prompts, implementation logs, and version milestones. |
| **`README.md`** | **User Guide & Live Links**: Contains the single CLI command for installing the latest APK on Android devices via ADB, and direct links to GitHub Pages (live web-app demo, web E2E tests, and Android emulator E2E tests). To update `README.md` for a new repository owner, run `npm run update:readme [username]` or `node scripts/update-readme.mjs [username]`. |
| **`COVERAGE.md`** | **Test Coverage Matrix**: Tracks E2E and unit test suites across Web Companion and Android Native Shell. Organizes tests into TODOs and DONE sections, moving items upon test passes and highlighting platform-unique tests. |
| **`AGENTS.md`** | **Architecture, Guidelines & Guardrails**: System documentation containing the app's design goals, component flow, subtitle fetching orders, platform separation rules, and protected files. |

---

## 2. Design Goal

The **YouTube Subtitle & Speech Flow Viewer** is an immersive language-learning platform designed to bridge authentic video media with synchronized comprehension tools:

1. **Synchronized Dual-Language Subtitles**:
   - Present authentic foreign-language video audio accompanied simultaneously by native transcript cues and dynamic target-language translations.
   - Configurable subtitle positioning (`top`, `above`, `under`, `bottom`) and toggleable translation orientation (`showTranslatedOnTop`).
2. **Speech Flow & Hardware TTS Narration**:
   - Sentence-by-sentence auditory repetition utilizing native Android hardware Text-to-Speech (`android.speech.tts.TextToSpeech`) or browser voice fallbacks.
   - Word-boundary visual highlighting (`HighlightableText.tsx`) synchronized with voice cadence.
   - Coordinated pause-and-resume loops between YouTube video playback and speech synthesis.
3. **Instant Target Language Switching**:
   - Support for 80+ world languages with on-the-fly switching during active video playback without restarting or freezing video state.
4. **Persistent Subtitle Caching & Offline Continuity**:
   - Zero redundant network requests for previously watched content through layered in-memory, localStorage (`yt_subtitles_*`), and native storage caches.
5. **Universal Video Ingestion & Link Sharing**:
   - Ingest any YouTube URL format (standard watch, youtu.be, Shorts, embeds, timestamps) via manual input, deep-link URL query parameters, or Android native OS `ACTION_SEND` share intents from the official YouTube app.

---

## 3. Application Flow & Component Integration

The application runtime is constructed from interconnected functional modules and UI elements:

```
+-----------------------------------------------------------------------------------+
|                                      Navbar                                       |
|  [Library Button]  [Share Button]  [Settings Button]  [Logs Button]  [APK Update] |
+-----------------------------------------------------------------------------------+
|                                   LinkInputBar                                    |
|  [#youtube-url-input]                 [#load-video-btn]       [#open-library-btn] |
+-----------------------------------------------------------------------------------+
|                                    VideoPlayer                                    |
|  - YouTube IFrame API Embed (`ref={playerRef}`)                                   |
|  - Dynamic Subtitle Overlays (Source Cue + Translated Cue)                        |
|  - Quick Control Bar: [#open-target-language-btn] [#open-logs-view-btn]           |
|  - Key Controls (Play/Pause, Theater Mode, Subtitle Position Dropdown)            |
+-----------------------------------------------------------------------------------+
|                               SubtitlesTeacherPanel                               |
|  - Sync Engine Controls: [Play/Pause] [Loop Cue] [Prev/Next] [Auto-TTS Toggle]    |
|  - Subtitle Cue Table: 25-row Pagination, Auto-Scroll to Active Cue, Search Filter|
|  - Target Language Selector & Voice Speech Rate Sliders                           |
|  - Tab Bar: [Browse Cached .SRT Tracks] (Authentic multi-lingual SRT fixtures)    |
|  - Observed TimedText Request Re-fetch Controls                                   |
+-----------------------------------------------------------------------------------+
|                     Modals & Diagnostics Overlay Layer                            |
|  - SelectTargetLanguageModal  - VideoLibraryModal    - ShareLinkModal             |
|  - SettingsModal              - ApkUpdateModal       - ActivityLogModal           |
|  - NetworkInspectorModal      - ErrorInspectorModal  - FloatingDiagnosticDock     |
|  - OfflineIndicator                                                               |
+-----------------------------------------------------------------------------------+
```

### Element Registry & Integration Contracts:

- **`Navbar`**:
  - Fixed header containing quick modal triggers: `#open-library-btn`, `#open-share-btn`, `#open-settings-btn`, `#open-logs-btn`, and `#apk-update-btn`.
  - Displays badge counter for saved library items and dynamic notifications when a newer APK version is detected on GitHub.
- **`LinkInputBar`**:
  - Primary URL ingestion component containing `#youtube-url-input` and `#load-video-btn`.
  - Parses video ID and timestamp, validates against YouTube domains, and dispatches to Redux `videoSlice` and `stateMachineSlice`.
- **`VideoPlayer`**:
  - Encapsulates the YouTube IFrame Player (`ref={playerRef}`) and coordinates playback time updates via `onTimeUpdate`.
  - Tracks playback state transitions (`isAutoTTSPausingRef` vs user pauses) to prevent state freezing during TTS speech loops.
  - Renders synchronized subtitle overlays according to user preferences (`subtitlePosition`: `top`, `above`, `under`, `bottom`).
  - Provides instant top-bar access to logs (`#open-logs-view-btn`) and target language selection (`#open-target-language-btn`).
- **`SubtitlesTeacherPanel`**:
  - The interactive learning workstation hosting the multi-column translation interface.
  - Connects to `useSyncEngine.ts` to coordinate video time boundaries, active cue detection, sentence looping, and utterance triggers.
  - Hosts the paginated subtitle table, active cue highlight row, and cached `.srt` file browser.
- **Redux State Slices**:
  - `videoSlice`: Stores active `videoId`, `url`, `startTime`, format type, captions toggle, and theater mode state.
  - `networkSlice`: Tracks all outgoing network, fetch, and native timedtext interception requests with duration and payloads.
  - `errorsSlice`: Captures HTTP errors, parse warnings, and audio fallback notices.
  - `stateMachineSlice`: Manages high-level lifecycle (`idle` -> `loading_video` -> `video_ready` -> `fetching_captions` -> `captions_loaded`).
- **Dataflow Synchronization**:
  - `VideoPlayer` emits current time via `handlePlayerTimeUpdate` -> `App.tsx` identifies `activeCue` -> triggers translation lookup in `translatedCueText` -> simultaneously displays overlay in `VideoPlayer` and highlights active row in `SubtitlesTeacherPanel`.

---

## 4. Subtitle Fetching Focus & Resolution Order

Subtitle acquisition follows distinct, deterministic resolution pipelines depending on the host platform:

> [!IMPORTANT]
> **Demo Application Fixture Exclusion**:
> The default demonstration video (`FcRzAdI8R9U`) is bundled with complete, authentic 1,578-cue `.srt` tracks in `test/fixtures/languages/*.srt` for source (`ru`) and target languages (`it`, `he`, `en`, `ar`).
> Therefore, **the demo application is strictly excluded from live network subtitle fetching and translation requests**. It resolves all dialogue and translations instantly from local fixtures with zero network overhead. Live network requests (server-side proxy or native WebView interception) are reserved exclusively for new, user-entered YouTube URLs.

### A. Subtitle Fetching Order for Android Native Shell:
1. **Authentic Local Fixtures & Cache (Demo Video Exclusion)**:
   - For demo video `FcRzAdI8R9U`, instantaneously loads bundled `.srt` fixtures without network calls.
   - For all videos, inspects `memoryCache` and app private storage (`getExternalFilesDir("youtube_captions")`).
2. **Native WebView Traffic Interception (`WebViewClient.shouldInterceptRequest`)**:
   - For user-provided YouTube videos, when the video player initiates playback inside the WebView, YouTube's internal caption requests to `youtube.com/api/timedtext` or `/timedtext?` are intercepted by native Kotlin code in `MainActivity.kt`.
   - The native shell captures the raw request headers, cookies, and endpoint parameters, saving the URL in `lastObservedTimedTextUrl`.
   - The native shell downloads the raw payload using `OkHttpClient`, writes it to a local disk file (`caption_<timestamp>.xml`), and returns the stream to the WebView so the player continues normally.
   - The raw bytes are Base64 encoded and dispatched directly into the web runtime via `window.onNativeCaptionsInterceptedBase64()`.
   - The web app decodes the UTF-8 payload, resolves encoding/Mojibake via `captionParser.ts`, extracts structured `CaptionCue[]`, saves them to cache, and triggers caption display.
3. **Native TimedText Repetition (`fetchTranslatedCaptions`)**:
   - When the user selects a target translation language for a non-demo video, the web layer invokes `AndroidNativeShell.fetchTranslatedCaptions(targetLang, "srt")`.
   - The native bridge clones the observed timedtext URL, appends `&tlang=<targetLang>&fmt=srt`, and executes the request using authentic YouTube session headers via `OkHttpClient`.
4. **Web API & Local Fixture Fallback**:
   - If native interception has not yet fired on custom videos, the app falls back to the `/api/fetch-subtitles` proxy.

### B. Subtitle Fetching Order for Web Companion:
1. **Authentic Local SRT Fixtures (Demo Video Priority)**:
   - For bundled demonstration videos (e.g. `FcRzAdI8R9U`), loads authentic 1,578-cue `.srt` tracks from `test/fixtures/languages/*.srt` for source (`ru`) and target languages (`it`, `he`, `en`, `ar`) without issuing network requests.
2. **Dedicated Per-Video Cache**:
   - Checks synchronous `memoryCache` first.
   - Checks browser `localStorage` key (`yt_subtitles_${videoId}`).
3. **Video Library Cache**:
   - Checks `yt_video_library_v2` for stored items matching the video ID.
4. **Server-Side API Proxy (`/api/fetch-subtitles`)**:
   - For custom user-entered videos only: invokes backend POST `/api/fetch-subtitles` with retry limit ($X=2$).
   - The Express backend uses server-side fetch to retrieve timedtext tracks from YouTube endpoints, bypassing browser CORS/Same-Origin restrictions.
5. **Fallback Mock Subtitles**:
   - If external network fetches fail or custom video has no accessible tracks, loads clean default cues (`defaultSubtitles.ts`) so CI/CD automated tests and public demos remain functional.
6. **Target Language Fetch / Client Translation**:
   - For non-demo videos: executes single `tlang` attempt or falls back to `translateService.ts` for individual active cues. Redundant translations (e.g. source language matching target language, or text already in target script) are skipped with logged warnings.

---

## 5. Web Companion vs. Android Native Shell: Focus on Native

The repository contains two operational facets, with explicit prioritization:

### 1. Android Native Shell (`android-shell/`) — PRIMARY FIRST-CLASS TARGET
- **The Core Product**: The final production deliverable is the compiled Android APK (`YouTube-Viewer-debug.apk`) running on Android devices and emulators.
- **Hardware TTS Acceleration**: Uses native Android `android.speech.tts.TextToSpeech` via `AndroidNativeShell.speak()`. This completely bypasses browser autoplay policies, maintains speech audio while the screen is locked, and supports offline voice packs.
- **Full Network Access**: Because it operates inside Android's native `WebViewClient`, it can inspect and intercept all HTTPS requests (`youtube.com/api/timedtext`) that browsers strictly prohibit due to the Same-Origin Policy.
- **OS Intent Integration**: Registers Android `ACTION_SEND` intent filter in `AndroidManifest.xml` to receive shared links directly from the native YouTube Android app.

### 2. Scoped Web Companion — TEST DRIVER & DEMO ONLY
- **Strict Scope**: The browser build exists solely to:
  1. Drive automated CI/CD test suites (Playwright and Cypress) in headless Linux runners.
  2. Host an interactive static demonstration on GitHub Pages.
- **Browser Constraints**: Standard web browsers enforce the Same-Origin Policy on cross-origin iframes; browser JavaScript *cannot* intercept YouTube timedtext network requests inside an iframe.
- **Architecture Protection Rule**: **NEVER modify or dismantle the Android native bridge (`MainActivity.kt`, `AndroidNativeShell`, `types.ts`) in an attempt to make browser iframe interception work like native Android.** Web-specific fallbacks must remain isolated within `subtitleCache.ts`, `server.ts`, and test fixtures.

---

## 6. Testing & CI/CD Workflow Pipeline Architecture

The project maintains an automated, artifact-driven continuous integration and deployment pipeline designed around explicit dependencies between build outputs and test executions:

### A. Web E2E Testing Pipeline (`.github/workflows/web.yml`)
- **Execution Mandate**: **Must run on the deployed website based on `.github/workflows/deploy-demo.yml`**.
- **Trigger Sequence**: Triggered via `workflow_run` upon successful completion of `Publish Web Demo to GitHub Pages` (`deploy-demo.yml`), as well as manual `workflow_dispatch` and `pull_request` events.
- **Target URL Resolution**: Evaluates the live GitHub Pages application URL (`https://<owner>.github.io/<repo>/app/`) and injects it into `PLAYWRIGHT_BASE_URL` and `CYPRESS_BASE_URL`. Playwright and Cypress test suites execute against the live deployment to validate actual production assets, scripts, and subtitle caches. Falls back to a local server instance only for pull request validation before deployment.
- **Reports & Artifacts**: Produces and uploads full Playwright test reports (`playwright-report/`) and Cypress Mochawesome test reports (`cypress/reports/`).

### B. Android Emulator E2E Testing Pipeline (`.github/workflows/emulation.yml`)
- **Execution Mandate**: **Must run on the build artifact based on `.github/workflows/release-apk.yml`**.
- **Trigger Sequence**: Triggered via `workflow_run` upon successful completion of `Build & Release Android APK` (`release-apk.yml`), as well as manual `workflow_dispatch` and `pull_request` events.
- **Artifact Retrieval & Staging**: Downloads the compiled `youtube-viewer-apks` release artifact (`YouTube-Viewer-debug.apk`) produced by the release workflow (with GitHub CLI fallback). Stages the pre-compiled APK directly into `android-shell/app/build/outputs/apk/debug/app-debug.apk`, completely skipping redundant Gradle compilation on the macOS runner.
- **Emulator Verification**: Boots an Android 14 (API 34) ARM64 virtual device, installs the pre-built APK via ADB (`adb install -r`), launches `com.ytviewer.app/.MainActivity` with authentic YouTube deep-links, captures logcat logs for `YT_CAPTION_INTERCEPTOR` and `TTS_ENGINE`, takes automated screen captures, and publishes the standalone Android emulator report.

### C. Dedicated Web Demo Deployment (`.github/workflows/deploy-demo.yml`)
- **Execution Mandate**: Sole dedicated workflow responsible for publishing the interactive web application demo and subtitle artifacts to GitHub Pages (`gh-pages`).
- **Trigger Sequence**: Triggers automatically on direct `push` to `main`/`master`, or after `Build & Release Android APK` completes. Upon deployment completion, it automatically triggers `web.yml` to verify the live deployed website.

---

## 7. File Protection Matrix

| Status | Paths | Rule |
| :--- | :--- | :--- |
| 🚫 **DO NOT MODIFY** | `android-shell/**`<br>`src/types.ts` (native bridge contracts)<br>`src/utils/captionParser.ts`<br>`src/utils/subtitleCache.ts` | Strictly protected. Alterations will break the compiled Android APK or native-to-JS bindings. |
| ✅ **SAFE TO MODIFY** | `src/components/**`<br>`src/store/**`<br>`e2e/**`, `cypress/**`<br>`src/index.css`<br>`update.apk.sh` | Presentation, UI components, state management, test suites, and distribution scripts. |

---

## 8. Verification Workflow

Before concluding any turn:
1. Move completed tasks from `PROMPT.md` to `CHANGELOG.md`.
2. Run `npm run update:readme [username]` (or `node scripts/update-readme.mjs`) whenever updating `README.md` for a target username.
3. Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript errors.
4. Run `compile_applet` (`npm run build`) to verify clean client and server compilation.
