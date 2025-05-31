import { test, expect } from '@playwright/test';

test('basic dialog test', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Check that dialog button is visible
  await expect(page.locator('#settings-button')).toBeVisible();

  // Open the dialog
  await page.click('#settings-button');

  // Check that the dialog opens
  await expect(page.locator('dialog#settings-dialog')).toBeVisible();

  // Check that at least one label is visible
  await expect(page.locator('label[for="_1"]')).toBeVisible();

  // Click on the OK button
  await page.click('#settings-ok');

  // Check that the dialog closes
  await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();
});
