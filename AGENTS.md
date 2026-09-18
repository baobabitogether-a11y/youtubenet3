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
|  - TTSInputTextsModal         - TTSQueueDebugger     - ParallelTranslationsOverlay|
|  - OfflineIndicator                                                               |
+-----------------------------------------------------------------------------------+
```

### Element Registry & Integration Contracts:

- **`Navbar`**:
  - Fixed header containing quick modal triggers: `#open-library-btn`, `#open-share-btn`, `#open-settings-btn`, `#open-logs-btn`, `#navbar-tts-inputs-button`, and `#apk-update-btn`.
  - Displays badge counter for saved library items and dynamic notifications when a newer APK version is detected on GitHub.
- **`LinkInputBar`**:
  - Primary URL ingestion component containing `#youtube-url-input` and `#load-video-btn`.
  - Parses video ID and timestamp, validates against YouTube domains, and dispatches to Redux `videoSlice` and `stateMachineSlice`.
- **`VideoPlayer`**:
  - Encapsulates the YouTube IFrame Player (`ref={playerRef}`) and coordinates playback time updates via `onTimeUpdate`.
  - Tracks playback state transitions (`isAutoTTSPausingRef` vs user pauses) to prevent state freezing during TTS speech loops.
  - Renders synchronized subtitle overlays according to user preferences (`subtitlePosition`: `top`, `above`, `under`, `bottom`).
  - Supports both single-language target subtitle display and multi-lingual `ParallelTranslationsOverlay`.
  - Provides instant top-bar access to logs (`#open-logs-view-btn`), target language selection (`#open-target-language-btn`), and inline `TTSQueueDebugger`.
- **`TTSQueueDebugger` & `TTSInputTextsView`**:
  - Real-time diagnostic interface docked directly under the player (`#tts-queue-debugger`).
  - Features dedicated list control presenting chronologically ordered TTS inputs ("Newer on Top" feed) with repeat tags (`REPEAT xN`), active speech progress indicators, quick-copy, search filters, and single-cue audio replays.
  - Provides visual red-light indicators (`#tts-repeat-red-light`) when speech synthesis encounters consecutive identical cue repetitions.
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

The project maintains an automated, artifact-driven continuous integration and deployment pipeline designed around explicit dependencies between build outputs, live deployments, and test executions:

```
+----------------------------------------------------------------------------------------------------+
|                                    1. Build & Release Workflow                                     |
|                                     (.github/workflows/release-apk.yml)                            |
|  - Compiles Web Bundle (Vite) & Bundles into Android Native Shell Assets                           |
|  - Builds Production Android APK: `YouTube-Viewer-debug.apk`                                       |
|  - Publishes GitHub Actions Artifacts: `youtube-viewer-apks` & `web-dist`                          |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                  Triggered upon completion
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                  2. Publish Web Demo to GitHub Pages                               |
|                                    (.github/workflows/deploy-demo.yml)                             |
|  - Unpacks web build into `./cypress/reports/app/`                                                 |
|  - Prepares Test Runner Portal (`scripts/prepare-report.mjs` -> `cypress/reports/index.html`)       |
|  - Deploys full interactive portal to GitHub Pages (`gh-pages` branch)                             |
+----------------------------------------------------------------------------------------------------+
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
+---------------------------------------------+   +--------------------------------------------------+
|           3. Web E2E Testing Pipeline       |   |        4. Android Emulator Testing Pipeline      |
|          (.github/workflows/web.yml)        |   |         (.github/workflows/emulation.yml)        |
| - Executes Playwright & Cypress Suites      |   | - Boots Android 14 (API 34) ARM64 Virtual Device|
|   against live deployed site on `gh-pages`  |   | - Installs APK via ADB & tests deep-link playback|
| - Generates step videos, screenshots, traces|   | - Captures logcats & high-res screen captures    |
| - Synchronizes reports & assets             |   | - Synchronizes `android-emulator-report.html`    |
| - Pushes updated test outputs to `gh-pages` |   | - Pushes updated emulator report to `gh-pages`   |
|   (`keep_files: true`)                      |   |   (`keep_files: true`)                           |
+---------------------------------------------+   +--------------------------------------------------+
```

### A. Dedicated Web Demo Deployment (`.github/workflows/deploy-demo.yml`)
- **Execution Mandate**: Sole workflow responsible for publishing the baseline interactive web application demo and subtitle artifacts to GitHub Pages (`gh-pages`).
- **Artifact Staging**: Bundles the built production SPA into `cypress/reports/app/` and executes `scripts/prepare-report.mjs` to establish the browsable HTML test runner and `.nojekyll` configuration.
- **Trigger Sequence**: Triggers automatically on direct `push` to `main`/`master`, or upon successful completion of `Build & Release Android APK`. Upon deployment completion, it automatically triggers `web.yml` to verify the live deployed website.

### B. Web E2E Testing Pipeline (`.github/workflows/web.yml`)
- **Execution Mandate**: **Must run on the deployed website based on `.github/workflows/deploy-demo.yml`**.
- **Trigger Sequence**: Triggered via `workflow_run` upon successful completion of `Publish Web Demo to GitHub Pages` (`deploy-demo.yml`), as well as manual `workflow_dispatch` and `pull_request` events.
- **Target URL Resolution**: Evaluates the live GitHub Pages application URL (`https://<owner>.github.io/<repo>/app/`) and injects it into `PLAYWRIGHT_BASE_URL` and `CYPRESS_BASE_URL`. Playwright and Cypress test suites execute against the live deployment to validate actual production assets, scripts, and subtitle caches. Falls back to a local server instance only for pull request validation before deployment.
- **Continuous `gh-pages` Test Output Synchronization**:
  - Automatically runs `node scripts/prepare-report.mjs` to integrate Cypress step-by-step videos, screenshots, and Playwright traces into `./cypress/reports`.
  - Publishes the updated `./cypress/reports` directly to `gh-pages` with `keep_files: true` so the live GitHub Pages site immediately presents updated test results without overwriting the application demo in `app/`.
  - Also archives downloadable artifacts (`playwright-e2e-report`, `cypress-e2e-report`) with 14-day retention.

### C. Android Emulator E2E Testing Pipeline (`.github/workflows/emulation.yml`)
- **Execution Mandate**: **Must run on the build artifact based on `.github/workflows/release-apk.yml`**.
- **Trigger Sequence**: Triggered via `workflow_run` upon successful completion of `Build & Release Android APK` (`release-apk.yml`), as well as manual `workflow_dispatch` and `pull_request` events.
- **Artifact Retrieval & Staging**: Downloads the compiled `youtube-viewer-apks` release artifact (`YouTube-Viewer-debug.apk`) produced by the release workflow (with GitHub CLI fallback). Stages the pre-compiled APK directly into `android-shell/app/build/outputs/apk/debug/app-debug.apk`, completely skipping redundant Gradle compilation on the macOS runner.
- **Emulator Verification**: Boots an Android 14 (API 34) ARM64 virtual device, installs the pre-built APK via ADB (`adb install -r`), launches `com.ytviewer.app/.MainActivity` with authentic YouTube deep-links, captures logcat logs for `YT_CAPTION_INTERCEPTOR` and `TTS_ENGINE`, takes automated screen captures, and generates `android-emulator-report.html`.
- **Continuous `gh-pages` Emulator Synchronization**:
  - Copies the Android emulator screenshot and report into `cypress/reports/`.
  - Publishes to `gh-pages` with `keep_files: true`, rendering the Option C Android emulator report instantly accessible via the top navigation bar of the deployed test portal.

---

## 7. File Protection Matrix & Repository Artifact Hygiene

### A. Protected Code & Architecture Boundaries

| Status | Paths | Rule |
| :--- | :--- | :--- |
| 🚫 **DO NOT MODIFY** | `android-shell/**`<br>`src/types.ts` (native bridge contracts)<br>`src/utils/captionParser.ts`<br>`src/utils/subtitleCache.ts` | Strictly protected. Alterations will break the compiled Android APK or native-to-JS bindings. |
| ✅ **SAFE TO MODIFY** | `src/components/**`<br>`src/store/**`<br>`e2e/**`, `cypress/**`<br>`src/index.css`<br>`update.apk.sh` | Presentation, UI components, state management, test suites, and distribution scripts. |

### B. Repository Artifact Hygiene & `.gitignore` Exclusion Rules

To ensure a pristine repository and prevent accumulation of heavy test captures, video recordings, and build binaries, all temporary output directories MUST be kept out of version control via `.gitignore`:

- **Automated Test & Report Outputs**:
  - `playwright-report/` & `test-results/`: Transient Playwright traces, videos, and JSON results.
  - `cypress/reports/`, `cypress/videos/`, `cypress/screenshots/`: Generated test media and Mochawesome bundles.
  - `android-emulator-report.html`, `android-emulator-screenshot.png`, `android-emulator-logcat.txt`: Transient emulator run outputs.
  - `blob-report/`, `playwright/.cache/`.
- **Android & Native Build Artifacts**:
  - `*.apk`, `*.aab`, `release-artifacts/`: Compiled application binaries.
  - `android-shell/.gradle/`, `android-shell/build/`, `android-shell/app/build/`, `android-shell/local.properties`, `android-shell/.idea/`.
- **Web Bundles & Environment Logs**:
  - `dist/`, `build/`, `coverage/`, `node_modules/`, `*.log`, `.env*` (except `.env.example`).

> [!CAUTION]
> **Zero Checked-In Artifacts Rule**: Coding agents must NEVER commit or persist test run outputs, video captures, or temporary `.html`/`.png` report files to the git repository. All live browsable presentations are published exclusively to the `gh-pages` branch by GitHub Actions workflows.

---

## 8. Verification & Zero-Error Workflow

Before concluding any development turn, the application MUST satisfy the **Zero-Error Standard**:

1. **Zero TypeScript Errors**: Run `lint_applet` (`tsc --noEmit`) to verify zero type mismatches, missing imports, or invalid property accesses.
2. **Zero Build Failures**: Run `compile_applet` (`npm run build`) to ensure both the Vite client bundle and the Express backend bundle compile cleanly with zero errors.
3. **Task Tracking Discipline**:
   - Move completed tasks from `PROMPT.md` to `CHANGELOG.md`.
   - Ensure `PROMPT.md` reflects only current or upcoming actionable items.
4. **README Sync**: Run `npm run update:readme [username]` (or `node scripts/update-readme.mjs`) whenever updating `README.md` for a target username.

---

## 9. Complicated Application Logic Analysis & Simplification Blueprints

Over the course of rapid feature expansion, several interconnected subsystems have grown in complexity. Below is a detailed breakdown of the four most complex systems, their root causes of friction, and actionable blueprints for future simplification.

### System 1: `VideoPlayer.tsx` & Auto-TTS Playback Loop State Coordination

#### Why It Is Complex:
- **Dual Pause Intentions**: The component must distinguish between a user-initiated pause (the user clicked pause or pressed Space) and an automatic pause triggered by the TTS engine (`isAutoTTSPausingRef = true`) when auto-narrating subtitle cues. If this state machine is desynchronized, the player either resumes playing while TTS is still speaking, or remains permanently frozen after speech concludes.
- **Polling vs Event Race Conditions**: YouTube IFrame API's native events (`onStateChange`) trigger asynchronously, while `timeUpdate` is polled via `requestAnimationFrame` or `setInterval` (200ms). When seeking or skipping cues, polled time updates can trigger outdated cue boundaries before the player acknowledges the seek.
- **Monolithic Component Size**: `VideoPlayer.tsx` exceeds 800 lines of code, encompassing the iframe DOM container, custom play/pause/timeline controls, theater mode toggles, subtitle position dropdowns, single-language subtitle overlays, multi-lingual `ParallelTranslationsOverlay`, inline `TTSQueueDebugger` docks, and error banners.

#### Concrete Simplification Blueprint:
1. **Extract Headless Playback State Machine (`usePlayerPlaybackSync`)**:
   - Encapsulate the YouTube IFrame player ref, current time polling, and pause/resume logic inside a custom hook or XState-style finite state machine with explicit states:
     ```ts
     type PlaybackState = 
       | 'UNSTARTED' 
       | 'BUFFERING' 
       | 'PLAYING' 
       | 'PAUSED_BY_USER' 
       | 'PAUSED_FOR_TTS' 
       | 'SEEKING';
     ```
   - Transitioning to `PAUSED_FOR_TTS` immediately blocks auto-resumes until `onSpeechCompleted` dispatches a `RESUME_AFTER_TTS` action.
2. **Component Decomposition**:
   - Split `VideoPlayer.tsx` into three lightweight sub-components:
     - `YouTubePlayerContainer.tsx`: Renders the raw iframe container with resize observers.
     - `VideoControlsOverlay.tsx`: Play/pause buttons, time slider, theater mode, and speed controls.
     - `SubtitleOverlayContainer.tsx`: Pure presentation component deciding whether to mount standard single-cue overlays or `ParallelTranslationsOverlay`.
   - Reduces `VideoPlayer.tsx` from 800+ LOC to under 180 LOC, eliminating subtle state cross-talk.

---

### System 2: Multi-Tier Subtitle Acquisition Pipeline & WebView Interception

#### Why It Is Complex:
- **Multiple Divergent Fetch Pathways**: Subtitles can originate from:
  1. Authentic bundled `.srt` language fixtures (`test/fixtures/languages/*.srt`) for demo video `FcRzAdI8R9U`.
  2. Memory cache (`memoryCache`).
  3. Browser `localStorage` (`yt_subtitles_*`).
  4. Video library storage (`yt_video_library_v2`).
  5. Android Native WebView HTTP interception (`WebViewClient.shouldInterceptRequest`) streaming raw Base64 bytes via `window.onNativeCaptionsInterceptedBase64()`.
  6. Native timedtext URL cloning (`AndroidNativeShell.fetchTranslatedCaptions`).
  7. Backend Express proxy (`/api/fetch-subtitles`).
  8. Fallback default mock cues (`defaultSubtitles.ts`).
- **Encoding & Timing Variances**: YouTube timedtext XML, JSON3, and standard SRT tracks format timestamps differently (seconds vs milliseconds vs `00:00:00,000`). In addition, YouTube's timedtext endpoints occasionally output HTML-escaped characters or corrupted UTF-8 Mojibake that requires heuristic multi-pass decoding in `captionParser.ts`.

#### Concrete Simplification Blueprint:
1. **Chain-of-Responsibility Pattern (`SubtitleResolutionCoordinator`)**:
   - Define a unified provider interface:
     ```ts
     interface ISubtitleProvider {
       name: string;
       canHandle(videoId: string, lang: string): boolean;
       resolve(videoId: string, lang: string): Promise<CaptionCue[] | null>;
     }
     ```
   - Register providers in priority order:
     `[LocalFixtureProvider, MemoryCacheProvider, NativeBridgeProvider, BackendProxyProvider, DefaultFallbackProvider]`
   - The coordinator calls `provider.resolve()` sequentially until a non-empty array is returned. This eliminates deeply nested `if/else` fallbacks in `useSyncEngine.ts` and `subtitleCache.ts`.
2. **Isolated Parser Pipeline**:
   - Move all regex sanitization, HTML entity decoding, and timestamp normalization into an immutable transformer: `RawCaptionPayload -> parseToCues() -> sanitizeCues() -> CaptionCue[]`.

---

### System 3: Three-Tier Hardware/Web/Audio TTS Narration Engine & Cancellation

#### Why It Is Complex:
- **Tri-Level Fallback Cascade**: When a cue triggers speech narration:
  1. *Tier 1*: Native Android hardware TTS via `AndroidNativeShell.speak()`.
  2. *Tier 2*: Browser `window.speechSynthesis.speak()`.
  3. *Tier 3*: Google Translate web audio stream fallback via HTML5 `new Audio(streamUrl).play()`.
- **Word-Boundary Visual Synchronization**: Highlighting words in `HighlightableText.tsx` as speech progresses requires listening to native speech boundary events (`onSpeechBoundary` / `SpeechSynthesisUtterance.onboundary`). If a browser lacks boundary support (e.g. mobile Safari or certain Chrome voices), a fallback estimation timer must be synthesized.
- **Asynchronous Cancellation & Rapid Cue Skipping**: If the user rapidly skips through 5 cues in 2 seconds, previous speech requests must be aborted instantaneously. Race conditions between pending audio stream fetches, active native speech utterances, and new speak requests can lead to overlapping audio ("audio dogpiling") or repeat loops.

#### Concrete Simplification Blueprint:
1. **Strategy / Adapter Pattern (`ITtsVoiceEngine`)**:
   - Abstract each speech engine behind an identical contract:
     ```ts
     interface ITtsEngineAdapter {
       isSupported(): boolean;
       speak(request: TTSRequest): Promise<TTSResult>;
       stop(): void;
     }
     ```
   - Encapsulate `NativeAndroidEngine`, `WebSpeechEngine`, and `AudioStreamFallbackEngine` into isolated modules.
2. **Tokenized AbortController Lifecycle**:
   - Maintain a single active `AbortController` in `ttsEngine.ts`.
   - When `speakText()` is invoked, immediately trigger `currentAbortController.abort()`, increment a monotonic `currentRequestId: number`, and pass the abort signal to the active adapter.
   - Any audio playback or speech boundary callback checking `requestId !== currentRequestId` immediately discards the event, mathematically preventing audio overlap and ghost callbacks.

---

#### System 4: Single vs Parallel Language Model Switching & Dynamic Track Alignment

#### Why It Is Complex:
- **Default Single-Language vs Parallel Overlays**: The platform defaults to a single active target language. However, the system supports switching target languages dynamically during active playback, as well as optional multi-language parallel display (`ParallelTranslationsOverlay.tsx`).
- **Timestamp Drift Between Source and Target Tracks**: When YouTube generates automated translations or when third-party SRT files are loaded, cue start times rarely align 100% with source audio. For example, a source cue might span `01:12.200 - 01:15.500`, while the translated cue starts at `01:12.800`. Index-based matching (`targetList[sourceIndex]`) fails whenever cue counts differ.
- **Redundant Translation Prevention**: Switching languages must avoid re-translating dialogue segments already fetched or present in memory, while skipping identical script source-to-target pairs (e.g. Italian to Italian) without throwing errors.

#### Concrete Simplification Blueprint:
1. **Normalized Translation Map**:
   - Store all translated dialogue in a two-dimensional normalized dictionary in Redux:
     ```ts
     // State: translationsByCueId[cueId][langCode] -> string
     state.translations[activeCue.id] = {
       'it': 'Ciao mondo',
       'he': 'שלום עולם',
       'ar': 'مرحبا بالعالم'
     };
     ```
   - Single-language overlays read `translations[activeCue.id]?.[currentTargetLang]`.
   - Multi-language overlays map over `enabledLanguages.map(lang => translations[activeCue.id]?.[lang])`.
2. **Timestamp Proximity Alignment Window**:
   - Standardize all cue matching using a maximum delta threshold:
     ```ts
     const matchedCue = targetCues.find(tc => Math.abs(tc.start - sourceCue.start) < 0.75);
     ```
   - Fallback to proportional duration interpolation if cue counts diverge significantly, preventing empty subtitle flashes during active video playback.

---

## 10. Multi-Fork Management & Autonomous Repository Identity Synchronization

When developers or organizations fork this repository, hardcoded URLs in `README.md` (CI badges, release APK downloads, ADB scripts, GitHub Pages demos, and test reports) initially point to the upstream repository owner and name. If left unmanaged, users downloading APKs from a fork will inadvertently download binaries from the upstream repo or encounter broken 404 links.

### A. Autonomous Repository Identity Synchronization Script (`scripts/update-readme.mjs`)

The repository includes a dedicated script (`scripts/update-readme.mjs`) designed to re-target all links and badges across `README.md` without requiring manual text editing.

- **Dynamic Identity Resolution**:
  - Automatically reads the GitHub Actions environment variable `GITHUB_REPOSITORY` (`owner/repo`) or `GITHUB_REPOSITORY_OWNER`.
  - Supports manual CLI arguments:
    ```bash
    # Syntax: node scripts/update-readme.mjs [owner] [repo]
    node scripts/update-readme.mjs my-org my-viewer-fork

    # Alternative syntax:
    node scripts/update-readme.mjs my-org/my-viewer-fork
    ```
- **Replaced URL Patterns**:
  1. GitHub Actions workflow status badges (`https://github.com/<owner>/<repo>/actions/workflows/`).
  2. Release APK download URLs (`https://github.com/<owner>/<repo>/releases/latest/download/YouTube-Viewer-debug.apk`).
  3. Raw GitHub download scripts (`https://raw.githubusercontent.com/<owner>/<repo>/main/update.apk.sh`).
  4. GitHub Pages live demo & report links (`https://<owner>.github.io/<repo>/app/`, `mochawesome.html`, etc.).
  5. Fallback historical username identifiers (`mostuf\d+`).

### B. Automated GitHub Actions Workflow Recipe (`.github/workflows/update-readme.yml`)

To guarantee zero-touch synchronization across forks on every push to the default branch, the repository provides `.github/workflows/update-readme.yml`:

```yaml
name: Ensure README Fork & Owner Sync

on:
  push:
    branches:
      - main
      - master
    paths:
      - 'README.md'
      - 'scripts/update-readme.mjs'
      - '.github/workflows/**'
  workflow_dispatch:

concurrency:
  group: update-readme-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write

jobs:
  sync-readme:
    name: Synchronize README.md with Repository Identity
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run README.md Synchronization
        run: node scripts/update-readme.mjs
        env:
          GITHUB_REPOSITORY: ${{ github.repository }}
          GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}

      - name: Commit and Push if README Changed
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          if ! git diff --exit-code README.md; then
            git add README.md
            git commit -m "chore(docs): synchronize README.md repository identity for ${{ github.repository }}"
            git push origin ${{ github.ref_name }}
          fi
```

---

## 11. Handling Repeated App Logic Issues via Isolated Mini Demo (`demo/`)

Complex reactive applications with high-frequency time tickers (200–350ms), multi-language state trees, hardware TTS loops, and modals are susceptible to subtle regressions (e.g., circular state updates, cue boundary jitter, and seeking race conditions). Debugging these within the full multi-component tree can be difficult due to overlapping side effects.

### A. The Mini Demo Sandbox Pattern (`/demo/`)

To isolate and eliminate repeated app logic regressions, the repository maintains an autonomous **Mini Demo Reference Application** located under `/demo/` (`demo/index.html` and `demo/mini-demo.ts`):

1. **Zero-Dependency Architecture**:
   - Completely standalone: excludes Redux, `SubtitlesTeacherPanel`, TTS queue debuggers, multi-language translation matrices, and native WebView bridge layers.
   - Built with pure TypeScript and direct YouTube IFrame API bindings.
2. **Single Hebrew Subtitle Track Constraint**:
   - Bundles exclusively 1 authentic subtitle track: **Hebrew (`he`)** with 1,578 cues parsed from `test/fixtures/languages/he.srt` (`demo/hebrewCues.ts`).
   - Features right-to-left (`dir="rtl"`) typography, high-contrast subtitle overlays, and time-frame boundaries.
3. **Pure Time-Sync Engine**:
   - Synchronizes video playback with active subtitle cues strictly based on start and end frames (`currentTime >= cue.start && currentTime <= cue.end`).
   - Renders a live cue table highlighting the active subtitle cue in real-time with smooth auto-scrolling.
   - Provides instant **click-to-seek**: clicking any Hebrew subtitle row seeks the YouTube player directly to `cue.start`.
4. **Accessing the Mini Demo**:
   - **Local Development**: Navigate directly to `http://localhost:3000/demo/`.
   - **Live Production & GitHub Pages**: Hosted at `https://<owner>.github.io/<repo>/demo/` and accessible from the top navigation bar of both the main application and the Cypress test runner portal (`cypress/reports/index.html`).

### B. Diagnostic Workflow for Coding Agents & Developers

When diagnosing or verifying subtitle synchronization issues:
1. **Reproduce in `demo/` First**: Verify if the timing discrepancy exists in the isolated `/demo/` player.
   - If `/demo/` reproduces the issue, the bug is mathematical (e.g. cue boundary rounding, YouTube IFrame player lag, or SRT time-frame parsing).
   - If `/demo/` functions perfectly, the bug in the main app is architectural (e.g. unmemoized React callbacks, Redux state thrashing, or circular TTS pause-and-resume loops).
2. **Algorithm Prototyping**: Always prototype improvements to seek algorithms, boundary interpolation, or cue matching inside `demo/mini-demo.ts` before propagating them into the main application.


