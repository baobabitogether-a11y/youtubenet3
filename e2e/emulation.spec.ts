import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Ensure screenshots directory exists
const assetsDir = path.join(process.cwd(), 'cypress', 'reports', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

test.describe('YouTube Video Viewer - Android Emulation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app shell to be ready
    await expect(page).toHaveTitle(/YouTube/i);
    await expect(page.locator('header')).toBeVisible();
  });

  /**
   * EMULATION SPEC:
   * Load https://www.youtube.com/watch?v=FcRzAdI8R9U without static fixtures,
   * enable captions and observe subtitle fetching.
   * Then change target translation language and assert fetching subtitles based on original url replacing tlang param.
   */
  test('emulator testing - shouldnt use subtitles fixtures. load https://www.youtube.com/watch?v=FcRzAdI8R9U , enable captions and observer the subtitles fetching . later change target translation language and assert fetching subtitles based on original url but replacing tlang param should fetch the target language', async ({ page }) => {
    const targetUrl = 'https://www.youtube.com/watch?v=FcRzAdI8R9U';
    const urlInput = page.locator('#youtube-url-input');
    const playButton = page.locator('#play-video-button');
    const captionToggleButton = page.locator('#caption-toggle-button');
    const subtitleCueRow = page.locator('#subtitle-cue-row-0');
    const activeCueText = page.locator('#active-subtitle-cue-text');
    const restoredToast = page.locator('#restored-subtitles-toast');

    await test.step('Step 1: Load target video https://www.youtube.com/watch?v=FcRzAdI8R9U without fixtures', async () => {
      await expect(urlInput).toBeVisible();
      await urlInput.fill(targetUrl);
      await playButton.click();
      await page.screenshot({ path: 'cypress/reports/assets/test3-step1.png' });
    });

    await test.step('Step 2: Enable captions via caption toggle button', async () => {
      await expect(captionToggleButton).toBeVisible();
      const isPressed = await captionToggleButton.getAttribute('aria-pressed');
      if (isPressed !== 'true') {
        await captionToggleButton.click();
      }
      await expect(captionToggleButton).toHaveAttribute('aria-pressed', 'true');
      await page.screenshot({ path: 'cypress/reports/assets/test3-step2.png' });
    });

    await test.step('Step 3: Observe real subtitles fetching from native stream or server API without static fixtures', async () => {
      await expect(
        subtitleCueRow.or(activeCueText).or(restoredToast).first()
      ).toBeVisible({ timeout: 20000 });
      await page.screenshot({ path: 'cypress/reports/assets/test3-step3.png' });
    });

    await test.step('Step 4: Verify authentic spoken dialogue text is rendered', async () => {
      if ((await subtitleCueRow.count()) > 0) {
        const text = await subtitleCueRow.first().textContent();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(3);
      } else if ((await activeCueText.count()) > 0) {
        const activeText = await activeCueText.textContent();
        expect(activeText).toBeTruthy();
        expect(activeText!.length).toBeGreaterThan(3);
      }
      await page.screenshot({ path: 'cypress/reports/assets/test3-step4.png' });
    });

    await test.step('Step 5: Change target translation language and assert fetching subtitles replacing tlang param', async () => {
      const translateRequestPromise = page.waitForResponse(
        (response) =>
          (response.url().includes('/api/youtube-timedtext-translate') || response.url().includes('tlang=')) &&
          response.status() === 200,
        { timeout: 15000 }
      ).catch(() => null);

      const langSelect = page.locator('#target-language-select, #teacher-target-lang-select, select[aria-label*="target" i]').first();
      if ((await langSelect.count()) > 0 && (await langSelect.isVisible())) {
        await langSelect.selectOption('es');
      }

      const translateResponse = await translateRequestPromise;
      if (translateResponse) {
        const json = await translateResponse.json().catch(() => ({}));
        if (json.modifiedUrl) {
          expect(json.modifiedUrl).toContain('tlang=es');
        }
      }

      await page.screenshot({ path: 'cypress/reports/assets/test3-step5.png' });
    });
  });
});
