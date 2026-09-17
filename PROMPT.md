# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
add to settings:
- by default dont tts-play (only show the target translation) [complact mode display - add quick control to turn it on ]
- by default use only 1 target language [complact mode display - add quick button to enable presentation of more languages ]
- by default also show the subtitles's time section besides the subtitles
```

## Active TODOs & Verification

- [x] **Task 1 (Settings Architecture & Defaults)**:
  - Add `autoPlayTTS: boolean` (default `false`) to `AppSettings` in `src/utils/appSettings.ts`.
  - Add `singleTargetLanguageMode: boolean` (default `true`) to `AppSettings` in `src/utils/appSettings.ts`.
  - Add `showSubtitleTimestamps: boolean` (default `true`) to `AppSettings` in `src/utils/appSettings.ts`.
  - Ensure `DEFAULT_TARGET_LANGUAGES` in `src/components/SubtitlesTeacherPanel.tsx` has only 1 language enabled by default (`it`).
- [x] **Task 2 (Settings UI in SettingsModal.tsx)**:
  - Add toggle for Auto-play TTS Narration (`#toggle-autoplay-tts-setting`, default OFF: only show target translation).
  - Add toggle for Single Target Language Focus (`#toggle-single-target-lang-mode`, default ON: 1 target language).
  - Add toggle for Subtitle Time Section (`#toggle-show-subtitle-timestamps`, default ON: show time section besides subtitles).
- [x] **Task 3 (Compact Mode & VideoPlayer Display)**:
  - By default, do not TTS-play (only show target translation). Add quick control (`#quick-toggle-tts-btn` and `#toggle-auto-tts-button`) in compact mode display to turn it ON.
  - By default, use only 1 target language. Add quick button (`#quick-enable-more-languages-btn` / `#quick-more-languages-btn`) in compact mode display to enable presentation of more languages. Present multi-language translation cues when enabled.
  - By default, show the subtitle's time section besides the subtitles (`#cue-time-section`).
- [x] **Task 4 (Verification & Quality Gates)**:
  - Run `npm run update:readme` to verify documentation synchronization.
  - Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript errors.
  - Run `compile_applet` (`npm run build`) to verify clean production build.
  - Move completed tasks to `CHANGELOG.md`.
