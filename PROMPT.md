# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
add another view which by default shows the tts input texts. use a list control to present the newer on top .etc
```

## Actionable Tasks

- [x] Task 1: Extend `ttsEngine.ts` to log and broadcast a full historical feed of TTS input records (`TTSInputRecord[]`) with `ttsInputsFeed` array prepended (newer on top).
- [x] Task 2: Implement dedicated `TTSInputTextsView.tsx` with a high-density, searchable, filterable list control featuring "Newer on Top" ordering, auto-scroll pinning, repeat tags, quick copy, and audio test replay.
- [x] Task 3: Set `TTSInputTextsView` as the default active tab in `TTSQueueDebugger.tsx` (`#tts-queue-debugger`).
- [x] Task 4: Create `TTSInputTextsModal.tsx` and integrate standalone launch triggers in `Navbar.tsx` (`#navbar-tts-inputs-button`) and `FloatingDiagnosticDock.tsx` (`#open-tts-inputs-floating-button`).
- [x] Task 5: Verify build, linting, and typecheck across entire application suite.

## Future / Backlog Tasks

- [ ] Future Task: Advanced multi-language TTS sequence playback (playing each language one after another in auto-TTS mode if configured).



