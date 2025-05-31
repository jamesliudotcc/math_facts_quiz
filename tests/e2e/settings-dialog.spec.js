import { test, expect } from '@playwright/test';

test.describe('Settings Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('should open settings dialog when clicking the button', async ({ page }) => {
    // Check that the dialog is initially closed
    await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();

    // Click the settings button
    await page.click('#settings-button');

    // Check that the dialog is now open
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();
  });

  test('should show checkboxes for all numbers 1-10', async ({ page }) => {
    // Open the dialog
    await page.click('#settings-button');

    // Wait for dialog to be visible
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Check that all 10 checkboxes are present and initially checked
    for (let i = 1; i <= 10; i++) {
      // Use the label text instead as it's more reliable for visibility testing
      const label = page.locator(`label[for="_${i}"]`);
      await expect(label).toBeVisible();

      // Check if checkbox is checked
      const checkbox = page.locator(`#_${i}`);
      await expect(checkbox).toBeChecked();
    }
  });

  test('should close dialog when OK button is clicked', async ({ page }) => {
    // Open the dialog
    await page.click('#settings-button');

    // Verify it's open
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Click the OK button
    await page.click('#settings-ok');

    // Verify the dialog is closed
    await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();
  });

  test('should save checkbox settings when closing the dialog', async ({ page }) => {
    // Open the dialog
    await page.click('#settings-button');

    // Wait for dialog to be visible
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Click on labels for even numbers (2, 4, 6, 8, 10) to toggle checkboxes
    for (let i = 2; i <= 10; i += 2) {
      // Find and click the label instead of directly interacting with the hidden checkbox
      const label = page.locator(`label[for="_${i}"]`);
      await expect(label).toBeVisible();
      await label.click();
    }

    // Click OK
    await page.click('#settings-ok');

    // Wait for dialog to close
    await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();

    // Open the dialog again
    await page.click('#settings-button');

    // Wait for dialog to be visible again
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Check that the previously unchecked boxes are still unchecked by examining label appearance
    for (let i = 1; i <= 10; i++) {
      // For checking the state, we can still use the checkbox element
      const checkbox = page.locator(`#_${i}`);
      const label = page.locator(`label[for="_${i}"]`);
      await expect(label).toBeVisible();

      if (i % 2 === 0) { // Even numbers should be unchecked
        await expect(checkbox).not.toBeChecked();
        // Verify label styling - unchecked labels don't have the blue background
        await expect(label).not.toHaveCSS('background-color', 'rgb(0, 123, 255)');
      } else { // Odd numbers should still be checked
        await expect(checkbox).toBeChecked();
      }
    }
  });

  test('should only generate problems using selected numbers', async ({ page }) => {
    // Open the dialog
    await page.click('#settings-button');

    // Wait for dialog to be visible
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Uncheck all checkboxes except for 3 and 7 by clicking their labels
    for (let i = 1; i <= 10; i++) {
      if (i !== 3 && i !== 7) {
        // Find and click the label instead of directly interacting with the hidden checkbox
        const label = page.locator(`label[for="_${i}"]`);
        await expect(label).toBeVisible();

        // Only click if the checkbox is currently checked
        const isChecked = await page.locator(`#_${i}`).isChecked();
        if (isChecked) {
          await label.click();
        }
      }
    }

    // Click OK
    await page.click('#settings-ok');

    // Wait for dialog to close
    await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();

    // Get 5 problems (reduced from 10 for test speed) and verify factors are only 3 and 7
    for (let i = 0; i < 5; i++) {
      // Get the current problem factors
      const factor1 = await page.locator('#factor1').textContent();
      const factor2 = await page.locator('#factor2').textContent();

      // Assert factors are either 3 or 7
      expect(["3", "7"]).toContain(factor1);
      expect(["3", "7"]).toContain(factor2);

      // Calculate the expected answer
      const answer = Number(factor1) * Number(factor2);

      // Submit an answer to get a new problem
      await page.fill('#answer', String(answer));
      await page.click('#submitAnswer');

      // Wait for the new problem to be loaded (looking for factor1 to change)
      await page.waitForTimeout(200);
    }
  });

  test('should keep settings from dialog state when pressing Escape', async ({ page }) => {
    // Open the dialog
    await page.click('#settings-button');

    // Wait for dialog to be visible
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Object to store dialog checkbox states at close time
    const dialogStates = {};

    // Change checkbox states for even numbers by clicking their labels
    for (let i = 2; i <= 10; i += 2) {
      // Find the label
      const label = page.locator(`label[for="_${i}"]`);
      await expect(label).toBeVisible();

      // Click the label to toggle the checkbox state
      await label.click();

      // Add a small delay between clicks to ensure they register
      await page.waitForTimeout(50);
    }

    // Store all checkbox states at close time
    for (let i = 1; i <= 10; i++) {
      dialogStates[i] = await page.isChecked(`#_${i}`);
    }

    // Press Escape to close the dialog
    await page.keyboard.press('Escape');

    // Wait for dialog to close
    await expect(page.locator('dialog#settings-dialog')).not.toBeVisible();

    // Open dialog again
    await page.click('#settings-button');

    // Wait for dialog to be visible again
    await expect(page.locator('dialog#settings-dialog')).toBeVisible();

    // Verify all checkboxes match their state at dialog close time
    for (let i = 1; i <= 10; i++) {
      await page.locator(`label[for="_${i}"]`).waitFor({ state: 'visible' });
      const isChecked = await page.isChecked(`#_${i}`);
      expect(isChecked).toBe(dialogStates[i]);
    }
  });
});
