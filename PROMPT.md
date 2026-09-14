# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
- Compact view shows translated text and plays Auto-TTS by default
- Navbar inspector triggers are always actionable
- Resolved body size limits and duplicate React voice keys
```

## Active TODOs & Verification

- [x] **Task 1 (Body Parser Limit)**: Increase express payload limit to 50MB to handle large base64 caption files without `PayloadTooLargeError`.
- [x] **Task 2 (Unique React Keys for Voices)**: Deduplicate voice lists across components and modals to eliminate key collision warnings.
- [x] **Task 3 (Navbar Inspector Buttons)**: Ensure Error and Network inspector triggers and dialogs are always mounted and responsive.
- [x] **Task 4 (Compact View Defaults)**: Enable captions, translation overlay (`displayTranslatedText`), and Auto-TTS narration by default upon video loading.
- [x] **Task 5 (Verification)**: Verify with `lint_applet` and `compile_applet`.
