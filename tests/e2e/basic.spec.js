import { test, expect } from '@playwright/test';

// This is a basic test to ensure the app loads properly
test('basic app functionality', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Check that basic elements are visible
  await expect(page.locator('#factor1')).toBeVisible();
  await expect(page.locator('#factor2')).toBeVisible();
  await expect(page.locator('#operator')).toBeVisible();
  await expect(page.locator('#equals')).toBeVisible();
  await expect(page.locator('#answer')).toBeVisible();
  await expect(page.locator('#submitAnswer')).toBeVisible();

  // Check that settings button is visible
  await expect(page.locator('#settings-button')).toBeVisible();
});
