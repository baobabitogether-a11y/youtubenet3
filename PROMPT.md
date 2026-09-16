# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
compact design - need to fix lang selection and tts-play to text sync (sync also by language, dont highlight text of lang 1 where tts-play lang 2)

add button to quickly select target languages.
create test for sync issues
```

## Active TODOs & Verification

- [x] **Task 1 (Strict Language-Bound TTS-Play to Subtitle Highlighting Sync)**: Updated `VideoPlayer.tsx` to ensure subtitle text highlighting and effective text replacement strictly check language code alignment (`normSyncLang === normTargetLang`). Spoken TTS audio for `lang 2` (e.g., English) will NOT highlight or corrupt subtitle text for `lang 1` (e.g., Italian). Added a live status indicator `TTS: EN` when TTS is speaking a secondary language.
- [x] **Task 2 (Quick Target Language Selection Button)**: Integrated quick target language buttons (`#quick-target-lang-overlay-btn` and `#open-target-language-btn`) directly into the compact view subtitle overlay and top player bar, enabling instant bringup of `SelectTargetLanguageModal` to switch languages on-the-fly during video playback.
- [x] **Task 3 (E2E Test for Sync Issues & Language Selection)**: Implemented Web Critical Test 7 in `e2e/web.spec.ts` to verify quick target language selection, modal bringup, and language-bound TTS highlighting logic.
- [x] **Task 4 (Build & Type Verification)**: Verified via `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`) with zero errors.


