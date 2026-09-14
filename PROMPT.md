# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
update the test (and implementation if required):

regarding:
Step 4.3: Target Language Switch with 'tlang' Replacement
- you will have to copy the original working request for the default subtitles together with all the request settings - not only the url params.
then change the tlang param.

- if request returns error - fallback to use the request on the backend (dont forget the full request together with the original headers and the other fields of the request)
- provide the https response results 
- response assertion: the number of subtitles records should be identical after changing the tlang for different language. also assert that the first subtitle record is different.
[AIS_METADATA_SECTION_START]
Selected code path: /src/config/fixtures.ts
Selected line start: 53
Selected line end: 53
Selected code: SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U
[AIS_METADATA_SECTION_END]
```

## Active TODOs & Verification

- [x] **Task 1 (Original Working Request Capture & Cloning with Settings)**:
  - In `/src/lib/translateService.ts`, capture the original working request (URL, method, headers, mode, credentials, other fields).
  - Clone all request settings (not just URL parameters) when preparing target language switch.
  - Replace the `tlang` query parameter in the cloned request URL.
- [x] **Task 2 (Client-First Execution & Backend Fallback with Full Request)**:
  - Attempt request on client first (Android shell or browser direct fetch).
  - If request returns an error (e.g. status not ok, network error, CORS), fallback to `/api/youtube-timedtext-translate` on the backend.
  - Forward the full request object together with all original headers and fields (`requestSettings`, `requestHeaders`, `originalRequest`, `cues`).
- [x] **Task 3 (Backend Implementation & HTTPS Response Results)**:
  - Update `/server.ts` `/api/youtube-timedtext-translate` to execute with cloned request settings and original headers.
  - Return complete HTTPS response results (`httpsResponse` with `status`, `statusText`, `ok`, `headers`, `url`).
  - Import `SAMPLE_AUTHENTIC_RUSSIAN_CUES`, `SAMPLE_AUTHENTIC_HEBREW_CUES_FCRZADI8R9U`, `SAMPLE_AUTHENTIC_TIMEDTEXT_HEADERS`, and `SAMPLE_AUTHENTIC_RUSSIAN_URL` from `/src/config/fixtures.ts` to ensure no hardcoded data in server code.
  - Ensure subtitle cue count is preserved across languages (identical count) and first subtitle record is translated.
- [x] **Task 4 (Update Tests with Assertions)**:
  - In `e2e/emulation.spec.ts` (Playwright) and `cypress/e2e/emulation.cy.ts` (Cypress):
    - Assert that the cloned request settings and headers are present.
    - Assert HTTPS response results are returned.
    - Assert `modifiedUrl` contains `tlang=...`.
    - Assert that the number of subtitle records is identical after changing `tlang` for different language (`cues.length === originalCount`).
    - Assert that the first subtitle record is different from the original subtitle text.
- [x] **Task 5 (Documentation & Reports Update)**:
  - Update `COVERAGE.md` and `scripts/generate-android-report.mjs` for Step 4.3.
- [x] **Task 6 (Verification Loop)**:
  - Run `lint_applet` (`tsc --noEmit`).
  - Run `compile_applet` (`npm run build`).
  - Run `npm run test:e2e:emulation`.
