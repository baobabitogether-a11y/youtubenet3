# Active Prompt & Task Tracking (PROMPT.md)

## Latest User Prompt

```text
1. add 1 workflow file dedicated to publish the web demo to the gh-page (* subtitles are based on artifact in the demo).

2. fix:
https://productionresultssa13.blob.core.windows.net/actions-results/3c190ecf-a1d1-4e49-8d78-b54a0e75cb42/workflow-job-run-e670240c-df75-5036-912d-1c64513c4882/logs/job/job-logs.txt...
```

## Active TODOs & Verification

- [x] **Task 1 (Dedicated Web Demo Publish Workflow)**: Created `.github/workflows/deploy-demo.yml` dedicated to building and deploying the live web application demo and subtitle artifacts (`cypress/reports/app`) to `gh-pages`.
- [x] **Task 2 (Fix CI Test 7 Visibility Failure)**: Updated `VideoPlayer.tsx` to render `#quick-target-lang-overlay-btn` directly on the active subtitle cue overlay (next to `#speak-orig-cue-btn`) and updated `e2e/web.spec.ts` Test 7 with robust locators, hover trigger, and timeouts.
- [x] **Task 3 (Verification)**: Ran `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`) with zero errors.



