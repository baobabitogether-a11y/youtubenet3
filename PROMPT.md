# Active Prompt & Task Tracking (PROMPT.md)

## Active Worklist Status

All actionable tasks from the latest prompt have been fully implemented, verified, and archived to `CHANGELOG.md`:

- [x] **Caption Icon Subtitle Detection Scoped to Android Native App**: Scoped automatic subtitle detection / fetching when enabling captions via the dedicated caption icon (`#caption-toggle-button`) strictly to the Android native platform via `isAndroidAppEnvironment()`, avoiding unrequested auto-fetches on web while preserving full native dialogue interception.
- [x] **E2E Test Verification**: Added **WEB CRITICAL TEST 16** in `e2e/web.spec.ts` testing platform-scoped caption toggling and UI accessibility states.
- [x] **Zero-Error Standard Verification**: Verified with `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`).

