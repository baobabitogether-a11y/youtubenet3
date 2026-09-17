# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
remember by default we use only 1 target language.
after enabling tts - it shouldn't change the list of target languages!
-
we dont deal yet with translation to multiple languages in parrallel.
```

## Actionable Tasks

- [ ] Task 1: Enforce single target language by default (`singleTargetLanguageMode: true`, only 1 target language active/enabled).
- [ ] Task 2: Ensure enabling TTS does NOT change the list of target languages or append extra languages to target languages.
- [ ] Task 3: Remove parallel multi-language translation and multi-language presentation in parallel from compact mode / VideoPlayer / SubtitlesTeacherPanel.
- [ ] Task 4: Ensure TTS speaks only for the single active target language (or source/active language as selected) and highlights that cue without modifying target languages.
- [ ] Task 5: Verify zero TypeScript errors (`lint_applet`), build cleanly (`compile_applet`), run `npm run update:readme mostuf25563`, and document in `CHANGELOG.md`.
