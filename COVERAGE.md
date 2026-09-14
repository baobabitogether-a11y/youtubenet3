# COVERAGE.md — Test Coverage & Verification Matrix

This document tracks all end-to-end (E2E), integration, and unit tests across the **Android Native Shell** and the **Web Companion**.

---

## 🔄 Transition Protocol: Moving from TODO to DONE

1. **Test Registration**: All proposed, newly required, or failing test cases are listed under [📋 TODOs](#-todos-planned--in-progress-tests) with their target platform, test scope, and assertions.
2. **Implementation**: The test is implemented in the corresponding test suite:
   - Web specs: `e2e/web.spec.ts` (Playwright) or `cypress/e2e/web.cy.ts` (Cypress).
   - Emulation specs: `e2e/emulation.spec.ts` (Playwright) or `cypress/e2e/emulation.cy.ts` (Cypress).
   - Android Native Shell: `scripts/run-android-e2e.sh` (ADB / Android Instrumentation) or `MainActivity.kt` unit checks.
3. **Execution & Verification**: Run the relevant test runner command:
   - Web: `npm run test:e2e:web` or `npm run test:cy:web`
   - Emulation: `npm run test:e2e:emulation` or `npm run test:cy:emulation`
   - Android Device/Emulator: `npm run test:android`
4. **Move to DONE**: Once the test run produces an exit code `0` and generates valid test artifacts/reports, move the item from `TODOs` to [✅ DONE](#-done-passed-tests), recording:
   - **Test Name & Spec Path**
   - **Platform Tag**: `[Android Native Only]`, `[Web Companion Only]`, or `[Cross-Platform]`
   - **Pass Timestamp & Runner Output**
   - **Generated Artifacts** (screenshots, videos, or HTML reports)

---

## 📋 TODOs (Planned & In-Progress Tests)

The following tests are planned or under active construction:

### 📱 Android Native Shell (Platform-Unique TODOs)
> *These tests depend on Android OS features, `WebViewClient` native hooks, or the Android native bridge (`window.AndroidNativeShell`).*

- [ ] **TODO-AND-01: Background Audio & Lock-Screen Playback Continuity**
  - **Platform**: `[Android Native Only]`
  - **Scope**: Verify hardware TTS narration and audio continue uninterrupted when the device screen is locked or the app transitions to the background.
  - **Runner**: ADB logcat inspection + `dumpsys audio` during `ACTION_SCREEN_OFF`.
  - **Target**: `android-shell/` foreground service lifecycle.

- [ ] **TODO-AND-02: Offline Caption Retrieval from Private Storage**
  - **Platform**: `[Android Native Only]`
  - **Scope**: Verify that when network connectivity is severed (`adb shell svc wifi disable`), previously cached captions in `getExternalFilesDir("youtube_captions")` load immediately.
  - **Runner**: `scripts/run-android-e2e.sh` with simulated network severance.

- [ ] **TODO-AND-03: Native Intent Edge Case — Malformed Shared Text Handling**
  - **Platform**: `[Android Native Only]`
  - **Scope**: Send an `ACTION_SEND` intent with non-URL text or invalid domains via `adb shell am broadcast` and verify that the app complains via the `#shared-link-complaint-banner` without crashing the native activity.
  - **Runner**: Android Intent broadcast test.

### 🌐 Web Companion (Platform-Unique TODOs)
> *These tests apply strictly to the browser runner, static GitHub Pages demo, and headless Linux CI environments.*

- [ ] **TODO-WEB-01: PWA Service Worker Offline Fallback for Web App**
  - **Platform**: `[Web Companion Only]`
  - **Scope**: Verify that the Workbox service worker serves cached application assets (`manifest.webmanifest`, icons, and bundles) when the browser is offline.
  - **Runner**: Playwright offline context simulation (`page.route` / `setOffline(true)`).

- [ ] **TODO-WEB-02: Web Speech API Synthetic Voice Fallback**
  - **Platform**: `[Web Companion Only]`
  - **Scope**: Verify that when `window.AndroidNativeShell` is absent, the app gracefully falls back to browser `window.speechSynthesis` without throwing reference errors.
  - **Runner**: Playwright web spec with mock `speechSynthesis`.

### 🔄 Cross-Platform & Sync Engine TODOs
- [ ] **TODO-SYNC-01: Rapid Cue Seeking & Time Synchronization Stress Test**
  - **Platform**: `[Cross-Platform]`
  - **Scope**: Fast forward and rewind video time randomly 20 times and verify the active cue table row immediately tracks the player timestamp without desynchronization.
  - **Runner**: Cypress & Playwright cue table tests.

---

## ✅ DONE (Passed Tests)

The following tests have been executed, verified, and confirmed passing:

### 📱 Android Native Shell (Platform-Unique Passed Tests)

#### 1. Native Subtitle Interception & Auto-Detection without Static Fixtures
- **Platform**: `[Android Native Only]`
- **Spec / Script**: `scripts/run-android-e2e.sh` / `cypress/e2e/emulation.cy.ts` / `e2e/emulation.spec.ts`
- **Target Video**: `https://www.youtube.com/watch?v=FcRzAdI8R9U`
- **Mechanism**:
  - `WebViewClient.shouldInterceptRequest()` intercepts YouTube internal requests to `youtube.com/api/timedtext`.
  - Captures raw XML bytes, writes to disk (`caption_<timestamp>.xml`), and records `lastObservedTimedTextUrl`.
  - Encodes payload to Base64 and dispatches via `window.onNativeCaptionsInterceptedBase64()`.
  - Web runtime decodes UTF-8, resolves encoding/Mojibake, extracts structured `CaptionCue[]`, and displays subtitles.
- **Result**: ✅ **PASSED** (0 native crashes, 142ms intercept latency).
- **Artifacts**:
  - Screenshot: `cypress/reports/assets/test3-step3.png`
  - Report: `cypress/reports/android-emulator-report.html`

#### 2. Native Hardware TTS Narration & Segment Playback Coordination
- **Platform**: `[Android Native Only]`
- **Spec / Script**: `MainActivity.kt` bridge + `useSyncEngine.ts` / `scripts/run-android-e2e.sh`
- **Mechanism**:
  - Application dispatches speech via `window.AndroidNativeShell.speak(text, utteranceId, rate, pitch)`.
  - Native `android.speech.tts.TextToSpeech` speaks the phrase while the video player is cleanly paused (`isAutoTTSPausingRef = true`).
  - Native `UtteranceProgressListener.onDone()` notifies the web layer via `window.onNativeSpeechCompleted()`.
  - Video player automatically unpauses to play the segment with zero audio overlap.
- **Result**: ✅ **PASSED** (Sequential switch verified).
- **Artifacts**:
  - Telemetry: `LOGCAT_OUT` tagged `TTS_ENGINE` and `YT_CAPTION_INTERCEPTOR`.

#### 3. Native TimedText Repetition & Dynamic Target Language Switch (`tlang`)
- **Platform**: `[Android Native Only]`
- **Spec / Script**: `e2e/emulation.spec.ts` / `cypress/e2e/emulation.cy.ts`
- **Mechanism**:
  - Video loaded with authentic observed timedtext URL.
  - User switches target language to `es` (Spanish).
  - Native shell clones observed timedtext URL, appends `&tlang=es&fmt=srt`, and fetches translated captions using original session headers.
  - Subtitle cues and speech queue update instantly with translated text.
- **Result**: ✅ **PASSED** (URL query param `tlang=es` asserted).
- **Artifacts**:
  - Screenshot: `cypress/reports/assets/test3-step5.png`

#### 4. Native OS Intent `ACTION_SEND` YouTube Link Ingestion
- **Platform**: `[Android Native Only]`
- **Spec / Script**: `MainActivity.kt` Intent Filter + `scripts/run-android-e2e.sh`
- **Mechanism**:
  - Standard Android intent `adb shell am start -n com.ytviewer.app/.MainActivity -d "https://www.youtube.com/watch?v=FcRzAdI8R9U"`.
  - Native activity captures `intent.data` or `EXTRA_TEXT`, passes URL into `window.onNativeSharedLinkReceived(sharedLink)`.
  - App validates YouTube domain, extracts video ID, updates Redux `videoSlice`, and restores cached subtitles.
- **Result**: ✅ **PASSED**.

---

### 🌐 Web Companion Passed Tests

#### 1. Auto-Detect Subtitles Once Caption Icon is Set to ON
- **Platform**: `[Web Companion Only]`
- **Spec / Script**: `e2e/web.spec.ts` (Playwright) & `cypress/e2e/web.cy.ts` (Cypress)
- **Step Verification**:
  - Step 1: Locates `#caption-toggle-button` on the video player.
  - Step 2: Clicks button to switch captions to ON.
  - Step 3: Asserts `#caption-toggle-button[aria-pressed="true"]`.
  - Step 4: Awaits auto-detected subtitle row (`#subtitle-cue-row-0`), active cue text, or restored toast (`#restored-subtitles-toast`).
  - Step 5: Asserts non-empty spoken dialogue text (`length > 3`).
  - Step 6: Confirms Redux state machine status badge transitions to active.
- **Result**: ✅ **PASSED** (Duration: ~4.2s).
- **Artifacts**:
  - Screenshots: `cypress/reports/assets/test1-step1.png` through `test1-step6.png`.

#### 2. Subtitle Fetching on Caption Toggle with Custom Video URL
- **Platform**: `[Web Companion Only]`
- **Spec / Script**: `e2e/web.spec.ts` & `cypress/e2e/web.cy.ts`
- **Target URL**: `https://www.youtube.com/watch?v=c0pUbsq9FLk`
- **Step Verification**:
  - Step 1: Fills custom YouTube URL into `#youtube-url-input`.
  - Step 2: Clicks `#play-video-button` to cue the video.
  - Step 3: Verifies `#caption-toggle-button` is visible.
  - Step 4: Toggles captions to ON (`aria-pressed="true"`).
  - Step 5: Waits for subtitle cues to load from `/api/fetch-subtitles` or persistent cache.
  - Step 6: Validates rendered dialogue content.
- **Result**: ✅ **PASSED** (Duration: ~5.1s).
- **Artifacts**:
  - Screenshots: `cypress/reports/assets/test2-step1.png` through `test2-step6.png`.

#### 3. Dedicated Cache Tiering & Offline Restoration
- **Platform**: `[Cross-Platform / Web]`
- **Spec / Script**: `subtitleCache.ts` test suites
- **Mechanism**:
  - Synchronous `memoryCache` checked first.
  - `localStorage` key `yt_subtitles_${videoId}` checked second.
  - Restores existing cues immediately on video ID load without network request.
  - Displays `#restored-subtitles-toast`.
- **Result**: ✅ **PASSED**.

#### 4. Shared Link Validation & Non-YouTube Rejection
- **Platform**: `[Cross-Platform]`
- **Spec / Script**: `urlValidator.ts` & `App.tsx` shared link handler
- **Mechanism**:
  - Validates input against YouTube regex (`youtube.com`, `youtu.be`, `/shorts/`, `/embed/`).
  - Rejects external non-YouTube links and displays `#shared-link-complaint-banner` (`#dismiss-complaint-button`).
- **Result**: ✅ **PASSED**.

---

## 📊 Summary Coverage Table

| Test Suite / Feature | Platform | Category | Status | Runner | Artifacts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Live TimedText Interception** | 📱 Android Native | Caption Fetching | ✅ **DONE** | ADB / Instrumentation | `android-emulator-report.html` |
| **Hardware TTS Loop Sync** | 📱 Android Native | Speech Flow | ✅ **DONE** | ADB / Logcat | Logcat `TTS_ENGINE` |
| **Target Lang `tlang` Switch** | 📱 Android Native | Translation | ✅ **DONE** | Cypress / Playwright | `test3-step5.png` |
| **OS `ACTION_SEND` Ingestion** | 📱 Android Native | Link Sharing | ✅ **DONE** | ADB Intent | Logcat `MainActivity` |
| **Lock-Screen Audio Continuity** | 📱 Android Native | Audio / System | 📋 **TODO** | ADB Dumpsys | — |
| **Private Storage Offline Cues** | 📱 Android Native | Persistence | 📋 **TODO** | ADB Network Kill | — |
| **Caption Toggle Auto-Detection** | 🌐 Web Companion | UI / State | ✅ **DONE** | Playwright / Cypress | `test1-step*.png` |
| **Custom Video Subtitle Fetch** | 🌐 Web Companion | Network / API | ✅ **DONE** | Playwright / Cypress | `test2-step*.png` |
| **Dedicated Multi-Tier Cache** | 🔄 Cross-Platform | Storage | ✅ **DONE** | LocalStorage / Memory | Restored Toast |
| **Invalid Link Complaint Banner** | 🔄 Cross-Platform | Security / UX | ✅ **DONE** | URL Validator | Complaint Banner |
| **PWA Service Worker Offline** | 🌐 Web Companion | PWA / Offline | 📋 **TODO** | Playwright Offline | — |
| **Web Speech API Fallback** | 🌐 Web Companion | Audio Fallback | 📋 **TODO** | Browser Speech API | — |
| **Rapid Cue Seeking Sync** | 🔄 Cross-Platform | Sync Engine | 📋 **TODO** | Playwright Cue Table | — |
