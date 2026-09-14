# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
add COVERAGE.md - add todos and done sections. mv from todo to done after test passes. some tests uniq to platform (i.e: detect subtitles only for android)
```

## Active TODOs & Verification

- [x] **Task 1 (Create COVERAGE.md)**: Created `COVERAGE.md` containing comprehensive test coverage tracking across the codebase.
  - *Status*: Completed & Verified.
- [x] **Task 2 (TODOs & DONE Sections)**: Structured `COVERAGE.md` with `## 📋 TODOs (Planned & In-Progress Tests)` and `## ✅ DONE (Passed Tests)` sections.
  - *Status*: Completed & Verified.
- [x] **Task 3 (Transition Protocol: Move from TODO to DONE)**: Added clear instructions and workflow on how to move tests from `TODOs` to `DONE` once tests pass (register, implement, run command, move to DONE with execution metadata, pass status, and artifacts).
  - *Status*: Completed & Verified.
- [x] **Task 4 (Platform-Unique Test Categorization)**: Explicitly classified and tagged tests that are unique to each platform:
  - *Android Native Shell Only*: Native WebView caption interception without fixtures (`youtube.com/api/timedtext`), Base64 UTF-8 JS bridge, hardware-accelerated TTS loops (`android.speech.tts.TextToSpeech`), dynamic `tlang` timedtext repetition, and OS `ACTION_SEND` intent reception.
  - *Web Companion Only*: Auto-detect captions toggle on video player, multi-tier cache fallback, `/api/fetch-subtitles` Express proxy with retry cap, and Web Speech API simulation.
  - *Status*: Completed & Verified.
- [x] **Task 5 (Cross-Documentation Sync)**: Updated `AGENTS.md` to reference `COVERAGE.md` in the Documentation File System table and archived prior completions in `CHANGELOG.md`.
  - *Status*: Completed & Verified.
- [x] **Task 6 (Verification Loop)**: Verified TypeScript compilation with `lint_applet` and full application compilation with `compile_applet`.
  - *Status*: Completed & Verified.
