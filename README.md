
# YouTube Subtitle & Speech Flow Viewer

[![Build & Release Android APK](https://github.com/baobabitogether-a11y/youtubenet3/actions/workflows/release-apk.yml/badge.svg)](https://github.com/baobabitogether-a11y/youtubenet3/actions/workflows/release-apk.yml)
[![End-to-End Test Suite](https://github.com/baobabitogether-a11y/youtubenet3/actions/workflows/e2e.yml/badge.svg)](https://github.com/baobabitogether-a11y/youtubenet3/actions/workflows/e2e.yml)

---

## 🌐 Live Web Demo & Interactive Previews

You can test and interact with the application live in your browser:

| Live Environment | Direct URL | Description |
| :--- | :--- | :--- |
| 🚀 **GitHub Pages Web Demo** | [**https://baobabitogether-a11y.github.io/youtubenet3/app/**](https://baobabitogether-a11y.github.io/youtubenet3/app/) | Standalone live browser build with responsive playback controls, dual-language subtitles (`top`/`above`/`under`/`bottom`), and instant target language translation switching. |
| ⚡ **Interactive Cypress Runner Demo** | [**https://baobabitogether-a11y.github.io/youtubenet3/**](https://baobabitogether-a11y.github.io/youtubenet3/) | Live interactive test runner with time-travel DOM snapshots, video playback, and test suite filter tabs. |
| ☁️ **Cloud Run Live Preview** | [**https://ais-pre-vsignv5vsfihcpe7wtj63o-82169901332.europe-west3.run.app**](https://ais-pre-vsignv5vsfihcpe7wtj63o-82169901332.europe-west3.run.app) | Full-stack container preview with active backend proxy endpoints and subtitle APIs. |

### What You Can Try in the Web Demo:
- **Full-Screen Video Player**: Tap to play/pause, scrub through videos, and toggle volume/captions.
- **On-The-Fly Target Language Translation**: Click the **Lang** button (`#open-target-language-btn`) in the top bar to switch languages during active playback without stopping the video.
- **Quick Bringup Activity & Network Logs**: Click the **Logs** button (`#open-logs-view-btn`) in the top bar to view real-time HTTP requests, response payloads, status codes, and the state machine ring buffer.
- **Configurable Subtitle Overlay**: Cycle positions (`top`, `above`, `under`, `bottom`) with translated subtitles stacked on top by default.
- **Video Library**: Paste any YouTube URL or select preset fixtures to load new videos with subtitle caching.

---

## 📱 How to Access the Android Emulator E2E Test Report on GitHub Pages

The end-to-end test execution report running on a real Android emulator (Google Pixel 7 / API 34 / Android 14) is publicly available on GitHub Pages:

### 1. Direct Links to Android Emulator Reports
- **Standalone Android Emulator Report**:
  👉 [**https://baobabitogether-a11y.github.io/youtubenet3/android-emulator-report.html**](https://baobabitogether-a11y.github.io/youtubenet3/android-emulator-report.html)
- **Embedded in Interactive Cypress Runner**:
  👉 [**https://baobabitogether-a11y.github.io/youtubenet3/#android**](https://baobabitogether-a11y.github.io/youtubenet3/#android)

### 2. How to Navigate and Inspect the Test on the GitHub Page:
1. **Open the Report Link**: Click either of the direct links above.
2. **Review the Emulation Verification Summary**:
   - **Target Device**: Google Pixel 7 (`arm64-v8a`) on Android 14.0 (API Level 34).
   - **Native Interception Test**: Validates that `MainActivity.kt`'s `WebViewClient.shouldInterceptRequest()` successfully captures `/api/timedtext` network requests and invokes `window.onNativeCaptionsInterceptedBase64()`.
   - **Hardware TTS Test**: Validates the `window.AndroidNativeShell.speak()` Java bridge for native speech synthesis.
3. **Inspect the Device Screenshot**:
   - View the captured high-resolution screenshot directly from the running emulator (`android-emulator-screenshot.png`).
4. **Audit the Android Logcat Output**:
   - Scroll through the embedded Logcat console filtered on `YT_CAPTION_INTERCEPTOR`, `TTS_ENGINE`, and `ActivityTaskManager` to confirm all assertions passed with exit code 0.
5. **Switch Views via the Top Navigation Bar**:
   - Easily toggle between **⚡ Cypress Runner**, **📱 Android Emulator Report**, **📋 Mochawesome Report**, **🔍 Playwright Trace**, and **🌐 Live Web App**.

---

## 📊 All GitHub Pages Links & Test Dashboards

| Test Suite / Dashboard | Direct Link | Description |
| :--- | :--- | :--- |
| 🌐 **Live Web Application** | [**Open Web App**](https://baobabitogether-a11y.github.io/youtubenet3/app/) | Standalone browser build with responsive playback controls, dual-language subtitles, and settings. |
| ⚡ **Interactive Cypress Runner Dashboard** | [**Open Cypress Runner**](https://baobabitogether-a11y.github.io/youtubenet3/) | DOM time-travel step inspection, pinned snapshots, video player with chapter markers, and test filters. |
| 📱 **Android Real Device Emulation E2E Report** | [**Open Android Report**](https://baobabitogether-a11y.github.io/youtubenet3/android-emulator-report.html) | Option C: Native WebView `shouldInterceptRequest` verification on Google Pixel 7 (Android 14 / API 34), Logcat audit, and hardware TTS loop verification. |
| 📱 **Android Emulation in Runner View** | [**Open in Runner (#android)**](https://baobabitogether-a11y.github.io/youtubenet3/#android) | Direct tab switch inside the interactive Cypress runner dashboard. |
| 📋 **Mochawesome Test Report** | [**Open Mochawesome Report**](https://baobabitogether-a11y.github.io/youtubenet3/mochawesome.html) | Suite breakdown, pass/fail metrics, step timing breakdown, and test assertion logs. |
| 🔍 **Playwright Trace Inspector** | [**Open Playwright Trace**](https://baobabitogether-a11y.github.io/youtubenet3/playwright/index.html) | Network timeline, console events, and action waterfall inspector. |

## 📲 Install & Update Android APK via CLI (Remote One-Liner)

To download and install the latest `YouTube-Viewer-debug.apk` directly onto a connected Android device or emulator via ADB **without cloning this repository or relying on any local files**, run this remote CLI command in your Terminal or Git Bash:

```bash
curl -fsSL https://raw.githubusercontent.com/baobabitogether1-hash/youtubenet4/main/update.apk.sh | bash
```

### Additional CLI Options & Repositories

- **Install latest from `youtubenet3` fallback:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/baobabitogether-a11y/youtubenet3/main/update.apk.sh | bash
  ```

- **Install a specific version / tag (e.g. `v1.0.16` or `v1.0.14`):**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/baobabitogether1-hash/youtubenet4/main/update.apk.sh | bash -s -- v1.0.16
  ```

- **Install from a direct release asset URL:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/baobabitogether1-hash/youtubenet4/main/update.apk.sh | bash -s -- "https://github.com/baobabitogether1-hash/youtubenet4/releases/download/v1.0.16/YouTube-Viewer-debug.apk"
  ```

- **Alternative using `wget`:**
  ```bash
  wget -qO- https://raw.githubusercontent.com/baobabitogether1-hash/youtubenet4/main/update.apk.sh | bash
  ```

The remote script automatically:
1. Locates `adb` on Windows (Git Bash / MSYS2), macOS, and Linux.
2. Queries the GitHub repository releases API for the latest `YouTube-Viewer-debug.apk`.
3. Downloads the APK to the system Downloads folder.
4. Runs `adb install -r -d` to install/upgrade the package `com.ytviewer.app`.
5. Launches `com.ytviewer.app/.MainActivity` on the connected target device.


