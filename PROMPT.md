# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
fix all tests. later after pushing to github the github actions shell use the workflow ymls to update the relevant online websites (test result/demo/readme links)
```

## Actionable Tasks

- [ ] Task 1: Inspect and run test suites (Playwright `e2e/web.spec.ts`, `e2e/emulation.spec.ts`, and Cypress specs) to identify all test failures or environment discrepancies.
- [ ] Task 2: Fix any failing tests or test environment setup (ensuring web, emulation, and reporting scripts run cleanly and produce valid outputs).
- [ ] Task 3: Ensure GitHub Actions workflow files (`.github/workflows/deploy-demo.yml`, `web.yml`, `emulation.yml`, `update-readme.yml`, `release-apk.yml`) correctly update online websites and links (GitHub Pages test runner portal, live app, demo, README, Mochawesome, Playwright traces, and Android emulator report).
- [ ] Task 4: Update `COVERAGE.md` to reflect all passing test suites and coverage matrix.
- [ ] Task 5: Verify zero compilation and linting errors (`lint_applet` and `compile_applet`).
- [ ] Task 6: Move completed tasks to `CHANGELOG.md` and summarize for the user.

