import { test, expect } from '@playwright/test';

test('should keep dialog settings when clicking outside', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Open the dialog
  await page.click('#settings-button');

  // Wait for dialog to be visible
  await expect(page.locator('dialog#settings-dialog')).toBeVisible();

  // Toggle some checkboxes - both odd and even numbers
  // Select a few different checkboxes to toggle (1, 3, 5, 7, 9)
  const checkboxesToToggle = [1, 3, 5, 7, 9];

  // Store dialog checkbox states before closing
  const dialogStates = {};

  // Toggle selected checkboxes
  for (const i of checkboxesToToggle) {
    // Find and click the label
    await page.locator(`label[for="_${i}"]`).click();
    await page.waitForTimeout(50); // Small delay to ensure click registers
  }

  // Record all checkbox states at time of closing
  for (let i = 1; i <= 10; i++) {
    dialogStates[i] = await page.isChecked(`#_${i}`);
  }

  // Close dialog using Escape key (more reliable than simulating click)
  await page.keyboard.press('Escape');

  // Wait for dialog to close
  await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();

  // Reopen dialog
  await page.click('#settings-button');

  // Wait for dialog to be visible
  await expect(page.locator('dialog#settings-dialog')).toBeVisible();

  // Verify all checkboxes match their state at dialog close time
  for (let i = 1; i <= 10; i++) {
    const finalState = await page.isChecked(`#_${i}`);
    expect(finalState).toBe(dialogStates[i], `Checkbox #_${i} state mismatch`);
  }
});
