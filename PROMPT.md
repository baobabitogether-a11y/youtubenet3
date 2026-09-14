# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
compact view - the presented text is not matching the tts-play text
```

## Active TODOs & Verification

- [x] **Task 1 (Presented Text vs TTS Spoken Text Sync)**: Synchronized `textToSpeak` with `localTranslatedText` in `VideoPlayer.tsx` so presented subtitle text on screen immediately updates to match spoken TTS text 1:1.
- [x] **Task 2 (Fallback Language Code Alignment)**: Fixed TTS language code selection to use source language (`detectedFormat?.language || 'auto'`) whenever TTS falls back to original subtitle text, preventing garbled cross-language voice output.
- [x] **Task 3 (Hebrew ISO Normalization in Player Hook)**: Normalized Hebrew language codes (`iw` / `il` -> `he`) in `VideoPlayer.tsx` target subtitle cache lookups.
- [x] **Task 4 (Verification)**: Ran `lint_applet` and `compile_applet` with zero TypeScript or build errors.

