# Active Prompt & Task Tracking (PROMPT.md)

## Active Worklist Status

All actionable tasks from the latest prompt have been fully implemented, verified, and archived to `CHANGELOG.md`:

- [x] **Dev Server Startup Fix**: Eliminated the transitively loaded `.srt` import by decoupling `src/utils/youtube.ts` from `src/config/appConfig.ts`.
- [x] **Dev Server Verification**: Confirmed `server.ts` starts cleanly and serves HTTP 200 on port 3000.
- [x] **Artifact Subtitles & Build**: Verified that all local `.srt` fixtures in `test/fixtures/languages/*.srt` load in the Subtitle Artifacts modal, and both `lint_applet` and `compile_applet` pass cleanly.
