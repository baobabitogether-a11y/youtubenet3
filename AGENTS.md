# AGENTS.md — Developer & Coding Agent Guidelines

## 0. Mandatory Prompt & Task Tracking Rule

> ⚠️ **CRITICAL DIRECTIVE**: Always update `PROMPTS.md` with the user's latest todo based on the user's prompt, and for each completed task — update the task's review.
> - Whenever a user sends new instructions or prompts, immediately document the specific tasks in `PROMPTS.md`.
> - As tasks are executed and verified, mark them complete (`[x]`) and provide a clear, factual review of the implementation and verification.

---

## ⚠️ Critical Rule for Coding Agents: How Not to Break This Application

This repository contains an Android-focused architecture:
1. **The Application is Dedicated for Android Devices**: The primary target is the Android Native Shell APK (`android-shell/`), running inside an Android `WebView` with custom native hooks, hardware TTS, and traffic interception.
2. **Web-App Scoped Usage**: A web version is maintained strictly to **help drive app tests (Playwright, Cypress) and serve as an interactive live demo of the app**. The app is fundamentally an **Android machine focus** application.

---

## 1. The Fundamental Platform Difference: Android Native Focus vs. Scoped Web Companion

### Android Machine Focus (Primary Dedicated Platform):
- The app is designed and dedicated for deployment and usage on real Android devices and Android emulators.
- The Android `WebView` runs with native permissions.
- In `MainActivity.kt`, the `WebViewClient.shouldInterceptRequest()` callback intercepts **all** HTTP/HTTPS traffic traversing the WebView—including network requests generated inside the cross-origin `<iframe>` for YouTube (`youtube.com/api/timedtext`).
- When an interception occurs, Android reads the stream, encodes the raw caption data to Base64, and calls `window.onNativeCaptionsInterceptedBase64(base64Payload)` into the web app.
- Android also binds a native Java bridge: `window.AndroidNativeShell` for hardware TTS (`speak`, `stopSpeaking`) and toast notifications.

### Web Version Scope (Test Driver & App Demo Only):
- The web browser build is **strictly scoped** to:
  1. Driving automated CI/CD test suites (Playwright E2E and Cypress runner tests).
  2. Providing an interactive live demo of the application (e.g. on GitHub Pages or local preview).
- Web browsers enforce the **Same-Origin Policy (SOP)** and **iframe sandboxing**.
- The parent web page **cannot** intercept, inspect, or eavesdrop on network requests or DOM elements inside the cross-origin YouTube player iframe (`https://www.youtube.com/embed/...`).
- **CRITICAL PRINCIPLE**: Because a standard web app cannot access the cross-origin iframe sandbox files or network traffic, **web browser testing and demo usage MUST rely on mocking, local caching (`src/utils/subtitleCache.ts`), and server API fallbacks (`/api/fetch-subtitles`) for fetching subtitles**.
- **DO NOT attempt to "fix" web iframe subtitle interception** by altering the Android native bridge or removing native hooks. Any attempt to eliminate the native interception mechanism will break the compiled Android APK!

---

## 2. File Protection Matrix: What You CAN and CANNOT Change

### 🚫 DO NOT MODIFY (Strictly Protected Files):
| File / Directory | Why It Must Not Be Changed |
| :--- | :--- |
| `android-shell/app/src/main/java/com/ytviewer/app/MainActivity.kt` | Implements native `shouldInterceptRequest` for `/api/timedtext`, OkHttp client, Base64 bridge, native TTS, and deep-link intent handling. |
| `android-shell/app/build.gradle` & `android-shell/build.gradle` | Android SDK configuration, dependencies, and packaging specs. |
| `android-shell/app/src/main/AndroidManifest.xml` | Application permissions (`INTERNET`, `ACCESS_NETWORK_STATE`) and Activity intent filters. |
| `src/types.ts` (`AndroidNativeShell` & `Window` extensions) | TypeScript contracts matching native Java bridge methods. Changing signatures will cause native-to-JS binding errors. |
| `src/utils/captionParser.ts` | Essential parsers for XML (timedtext), JSON3, SRT, VTT, and UTF-8 Mojibake repairs. |
| `src/utils/subtitleCache.ts` | Local persistence contract and built-in fallback subtitle library for offline/web environments. |

### ✅ SAFE TO MODIFY (Presentation, State & Tests):
| Area | Purpose |
| :--- | :--- |
| `src/components/*` | UI components, inspectors, visual layouts, modal dialogs, and panels. |
| `src/store/*` | Redux slices, state machines, error logging, and traffic monitoring. |
| `e2e/*` | Playwright test suites (e.g. caption detection tests). |
| `src/index.css` | Global styling & Tailwind utilities. |
| `update.apk.sh` | Shell script for APK downloading and automated ADB installation. |

---

## 3. Subtitle Fetching Flow: Web vs. Android

```
[User clicks or toggles CC / Caption Icon]
               │
       Is Android Native Shell?
       ├── YES: Android WebViewClient intercepts https://youtube.com/api/timedtext
       │        └── Calls window.onNativeCaptionsInterceptedBase64() -> App parses & caches
       │
       └── NO (Web Browser Environment):
                ├── 1. Check local cache (src/utils/subtitleCache.ts)
                ├── 2. Auto-detect from YouTube watch page or server API (/api/fetch-subtitles)
                └── 3. If in test/offline environment, provide mocked / cached cues
```

---

## 4. Redux State Machine & Error Handling Architecture

The application uses Redux Toolkit (`src/store/`):
- **`stateMachineSlice`**: Tracks state machine transitions (`idle` ➔ `loading_video` ➔ `fetching_captions` ➔ `captions_loaded` ➔ `playing` ➔ `paused` ➔ `syncing_tts`). Every state transition and dispatched action is audited with timestamps and payloads.
- **`errorsSlice`**: Groups errors into distinct sections:
  1. *State Machine & Action Errors*
  2. *Network & HTTP Errors*
  3. *Subtitle & Captions Errors*
  4. *Player & Iframe Errors*
  5. *Unhandled System Errors*
- **`networkInspectorSlice`**: Captures every web request/response (`fetch`, `XMLHttpRequest`, native interception) with headers, status codes, durations, and payloads.

---

## 5. E2E Testing Protocol

- The primary test is the **Caption Auto-Detection Test** (`e2e/app.spec.ts`).
- When the caption icon / toggle is set to ON, the application must detect and load subtitles without mocking in real execution.
- Non-essential tests should remain skipped (`test.skip`) to prevent false negatives in CI environments.

---

## 6. App Execution Strategy

```yaml
app_execution_strategy:
  phase_1_observability_and_rate_control:
    step_1_1_safe_logging:
      description: Implement a fixed-size ring buffer for logs. Truncate response bodies to X characters ONLY within log entries to preserve app payload data. Ensure log copying reads directly from this buffer for guaranteed access.
    step_1_2_loop_and_resource_detection:
      description: Add counters and rate caps for each Redux action and API request type to throttle operations, detect infinite loops, and prevent resource exhaustion.
  phase_2_platform_separation_and_data_setup:
    step_2_1_web_testing_setup:
      description: Configure web platform to use mocked subtitle fixtures strictly. Disable native subtitle detection and fetching on web.
    step_2_2_android_native_setup:
      description: Set Android emulator as the dedicated platform for native subtitle detection, fetching, and captions-enabled integration.
    step_2_3_fallback_and_manual_controls:
      description: Disable automatic subtitle and translation fetching on boot. Require manual trigger buttons, enable fallback to default subtitles only, and set max retry limit to X=2.
  phase_3_core_playback_loop:
    step_3_1_sequential_switch_logic:
      description: Implement an alternating playback sequence (play TTS for block, play video segment, play TTS for next block, play video segment) ensuring neither mode overlaps.
    step_3_2_execution_validation:
      description: Validate playback flow by executing single and consecutive multi-block transitions and logging each switch to the safe log buffer.
  phase_4_e2e_verification_sequence:
    step_4_1_android_native_captions:
      description: Run E2E test on Android emulator to verify native subtitle detection using fixture https://www.youtube.com/watch?v=HGEyIt2bMiE with captions enabled.
    step_4_2_playback_flow_integration:
      description: Verify alternating TTS and video playback cycle on Android emulator.
    step_4_3_android_target_language_switch:
      description: Verify translation fetching on Android emulator by switching tlang to a target language.
    step_4_4_web_translation_flow:
      description: Verify on-demand Google Translation on web platform, strictly limited to the next X=4 subtitles.
```

---

## 7. Android UI Design Guidelines

```yaml
android_ui:
  principles:
    - lightweight
    - no_scrolling
    - minimal_controls
    - minimal_text
    - simple_navigation
    - user_respect

  main_screen:
    video:
      display: full_screen
      controls: show_on_tap
    controls:
      - play_pause
      - back_close
      - volume
      - progress_bar
      - settings

  settings:
    behavior:
      pause_video_when_opened: true
      use_simple_toggles: true
      avoid_nested_menus: true
      avoid_scrolling: true
    feedback:
      show_brief_confirmation: true

  navigation:
    prefer_single_screen: true
    back_button: obvious

  accessibility:
    large_touch_targets: true
    readable_contrast: true
    screen_reader_support: true
    icon_labels: true

  avoid:
    - unnecessary_controls
    - excessive_text
    - advertisements
    - redundant_buttons
    - decorative_elements
    - unnecessary_animations
```

---

## 8. Application Flow, Screen Architecture & Design Decisions

### 8.1 Target Language Availability During Playback
- **Always Available**: Changing the target translation language remains 100% accessible while the video is playing.
- **Dedicated Top-Bar Control**: The `#open-target-language-btn` in the video player top bar is always visible (under default `alwaysShowKeyControls: true`).
- **Real-Time Dynamic Update**: Selecting a new language opens `SelectTargetLanguageModal`, immediately updates `selectedTargetLang`, saves to per-video storage, and recomputes `translatedCueText` on the fly without stopping, pausing, or reloading the video.

### 8.2 App Screens & Available Controls
1. **Full-Screen Video Player Screen (`compactView: true` — Default)**:
   - *Top Bar*: Back/Close (`#back-close-button`), Video ID badge, **Log View (including Network Requests)** quick button (`#open-logs-view-btn`), **Edit Target Languages for Translation** quick button (`#open-target-language-btn`), Subtitle Position quick-cycle button (`#cycle-subtitle-position-btn`), Settings button (`#open-settings-button`).
   - *Center*: Tap-to-play/pause toggle (`#center-play-pause-toggle`) and buffering loader.
   - *Subtitle Overlay*: Positioned (`top`, `above`, `under`, `bottom`) with `#active-subtitle-cue-text` and `#active-translated-cue-text` (translated text on top by default).
   - *Bottom Bar*: Play/Pause (`#play-pause-toggle-button`), Caption CC (`#toggle-captions-button`), Volume/Mute (`#volume-mute-toggle`), Seek Scrubber (`#video-progress-scrubber`), timestamp/duration, Fullscreen (`#fullscreen-toggle-button`).
2. **Subtitles Teacher & Workspace Screen (`compactView: false` — Expanded Mode)**:
   - Embedded player card with quick bringup buttons (`#open-logs-view-btn-expanded`, `#open-target-language-btn-expanded`), subtitle search input, format indicator badge, sequential sync toggle (alternating TTS and video playback), and subtitle cue table with interactive timestamps, audio TTS buttons, slow speech (0.75x) toggle, cue loop buttons, and multi-column translations.
3. **Video Library & URL Entry Drawer (`LibraryModal.tsx`)**:
   - YouTube URL / Video ID input with "Load Video" submit button, preset video carousel (e.g. Russian interview `FcRzAdI8R9U`), saved video history cards with thumbnails, title, cue count, and delete button.
4. **Target Language Selection Modal (`SelectTargetLanguageModal.tsx`)**:
   - Grid of target languages (Spanish, Italian, French, German, Arabic, English, Russian, etc.), per-language TTS speech rate sliders (0.5x to 2.0x), and active language checkmark.
5. **Settings Modal (`SettingsModal.tsx`)**:
   - Compact Mode toggle, Subtitle Position dropdown (`top`, `above`, `under`, `bottom`), Translated Subtitles on Top toggle, Always Show Key Controls toggle, Auto-fetch Target Translations (`tlang`) toggle, Max Retries selector, Preferred Learning Languages selector, Native Android TTS engine toggle, and Check/Download APK buttons.
6. **Network Inspector & Error Logs Modals**:
   - Live auditing of intercepted timedtext requests, response payloads, status codes, and Redux state machine transitions.

### 8.3 Screen Trigger Matrix
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

### 8.4 Options to Trigger Video Playback
1. **Screen Tap**: Tap anywhere on the video container.
2. **Center Play/Pause Toggle**: Tap the high-contrast center button (`#center-play-pause-toggle`).
3. **Bottom Toolbar Play/Pause Button**: Click `#play-pause-toggle-button`.
4. **Selecting a Video from Library**: Tap any saved video item or curated quick-pick preset.
5. **Submitting YouTube URL / ID**: Paste URL in drawer and click "Load Video".
6. **Android Native Intent / Shared Link**: Share a link from YouTube Android app into `MainActivity.kt` via `window.onNativeSharedLinkReceived(url)`.
7. **Keyboard Shortcut**: Press Spacebar.
8. **Clicking a Subtitle Cue**: Click any subtitle row or timestamp in the Subtitles Panel to seek and play.

### 8.5 Cached Data per Video
- **`yt_subtitles_${videoId}`**: Subtitle cues array (`id`, `start`, `duration`, `text` with Mojibake repair), video title, original URL, and timestamp.
- **`yt_observed_url_${videoId}`**: Discovered/intercepted native `/api/timedtext` URL with session tokens and signature.
- **`yt_video_library_v2`**: Persistent library of opened videos with metadata, cues, timestamp, and preferences.
- **`memoryCache`**: High-speed in-memory RAM cache for instantaneous cue lookups during playback.

### 8.6 Stored Per-Video Settings (`yt_video_settings_${videoId}`)
- **`activeTargetLang`**: Last chosen target translation language for that video.
- **`targetLanguages`**: Enabled target languages configured for that video.
- **`ttsRates`**: Per-language speech rate multipliers (e.g. `{"es": 1.0, "fr": 0.85}`).
- **`playOrder`**: Sequential sync preference (`'tts_first'` vs `'video_first'`).
- **`sourceLang`**: Primary spoken language of the video.
- **`lastUpdated`**: Epoch timestamp of latest settings update.

### 8.7 Video Playback Screen Quick Bringup Buttons
- **Mandatory Quick Bringup Buttons on Video Playback Screen**:
  1. **Log View (including network requests)** (`#open-logs-view-btn`): Directly brings up the Activity & Network Logs view (`ActivityLogModal`), providing instant access to the chronological activity ring buffer, real-time HTTP network traffic (`#filter-btn-NETWORK`), request status codes, durations, response payloads, search filtering, and log clipboard export.
  2. **Edit Target Languages for Translation** (`#open-target-language-btn`): Directly brings up `SelectTargetLanguageModal` to switch active translation target language on the fly, adjust per-language TTS speech rates, and customize/edit the user's defined learning languages list.




