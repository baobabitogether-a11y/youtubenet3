# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
1. update AGENTS.md regarding testing:

.github/workflows/web.yml - should run on the deployed website based on : .github/workflows/deploy-demo.yml

.github/workflows/emulation.yml - should run on the build artifact based on .github/workflows/release-apk.yml
--
2. act accordingly
```

## Active TODOs & Verification

- [x] **Task 1 (Update AGENTS.md regarding Testing)**: Added Section 6 "Testing & CI/CD Workflow Pipeline Architecture" defining that `web.yml` runs on the live deployed website based on `deploy-demo.yml`, and `emulation.yml` runs on the pre-built build artifact based on `release-apk.yml`.
- [x] **Task 2 (Act Accordingly - Workflows & Configs Alignment)**:
  - Updated `.github/workflows/web.yml` to trigger on `Publish Web Demo to GitHub Pages` (`deploy-demo.yml`), detect the deployed website URL, and pass `PLAYWRIGHT_BASE_URL` & `CYPRESS_BASE_URL` to test the live deployed site.
  - Updated `.github/workflows/deploy-demo.yml` to remove circular trigger on `Web E2E Tests`.
  - Updated `.github/workflows/emulation.yml` to verify and stage the pre-built `youtube-viewer-apks` release artifact with GitHub CLI fallback.
  - Updated `playwright.config.ts` to support dynamic `PLAYWRIGHT_BASE_URL`, bypassing the local dev server when testing against the deployed site.
- [x] **Task 3 (Verification & Documentation Sync)**: Ran `npm run update:readme`, `lint_applet` (`tsc --noEmit`), and `compile_applet` (`npm run build`) with zero errors. Moved completed records to `CHANGELOG.md`.




