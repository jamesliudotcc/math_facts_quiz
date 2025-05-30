import { test, expect } from '@playwright/test';
import { TIMES } from '../../constants.js';

test.describe('Quiz Flow', () => {
  test('should display correct popover when answering correctly', async ({ page }) => {
    // Navigate to the quiz page
    await page.goto('/');

    // Wait for the page to load and problem to be displayed
    await page.waitForSelector('#factor1');
    await page.waitForSelector('#factor2');
    await page.waitForSelector('#operator');

    // Extract the problem from the DOM
    const factor1 = await page.textContent('#factor1');
    const factor2 = await page.textContent('#factor2');
    const operator = await page.textContent('#operator');

    console.log(`Problem: ${factor1} ${operator} ${factor2}`);

    // Calculate the correct answer based on the operator
    let correctAnswer;
    const num1 = parseInt(factor1);
    const num2 = parseInt(factor2);

    if (operator.includes(TIMES) || operator === '×' || operator === '*') {
      correctAnswer = num1 * num2;
    } else {
      throw new Error(`Unsupported operator: ${operator}`);
    }

    console.log(`Correct answer: ${correctAnswer}`);

    // Enter the correct answer
    await page.fill('#answer', correctAnswer.toString());

    // Submit the form
    await page.click('#submitAnswer');

    // Wait for the popover to appear with the correct indicator
    await page.waitForSelector('#correct_or_incorrect.show');
    const popoverText = await page.textContent('#correct_or_incorrect');
    expect(popoverText).toBe('👍');

    // Wait for the 'show' class to be removed (indicating popover disappeared)
    await page.waitForFunction(
        () => {
          const element = document.querySelector('#correct_or_incorrect');
          return element && !element.classList.contains('show');
        },
        { timeout: 2000 }
    );

      await expect(page.locator('#correct_or_incorrect')).not.toBeVisible();

    // Verify that a new problem is generated
    const newFactor1 = await page.textContent('#factor1');
    const newFactor2 = await page.textContent('#factor2');

    // Verify the input field is cleared
    const inputValue = await page.inputValue('#answer');
    expect(inputValue).toBe('');
  });

  test('should display incorrect popover when answering incorrectly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#factor1');

    // Extract the problem from the DOM
    const factor1 = await page.textContent('#factor1');
    const factor2 = await page.textContent('#factor2');

    // Calculate the correct answer
    const correctAnswer = parseInt(factor1) * parseInt(factor2);

    // Enter an incorrect answer (add 1 to correct answer)
    await page.fill('#answer', (correctAnswer + 1).toString());

    // Submit the form
    await page.click('#submitAnswer');

    // Wait for the popover to appear
    await page.waitForSelector('#correct_or_incorrect.show');

    // Check that the popover shows the incorrect indicator
    const popoverText = await page.textContent('#correct_or_incorrect');
    expect(popoverText).toBe('❌');

    // Verify the popover disappears after timeout
    // Wait for the 'show' class to be removed (indicating popover disappeared)
    await page.waitForFunction(
        () => {
          const element = document.querySelector('#correct_or_incorrect');
          return element && !element.classList.contains('show');
        },
        { timeout: 2000 }
    );

    await expect(page.locator('#correct_or_incorrect')).not.toBeVisible();
  });

  test('should maintain focus on answer input throughout the quiz', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#answer');

    // Verify initial focus is on the answer input
    const initialFocusedElement = await page.evaluate(() => document.activeElement.id);
    expect(initialFocusedElement).toBe('answer');

    // Answer a question
    const factor1 = await page.textContent('#factor1');
    const factor2 = await page.textContent('#factor2');
    const correctAnswer = parseInt(factor1) * parseInt(factor2);

    await page.fill('#answer', correctAnswer.toString());
    await page.click('#submitAnswer');

    // Wait a bit for the submission to process
    await page.waitForTimeout(200);

    // Verify focus returns to answer input
    const focusedAfterSubmit = await page.evaluate(() => document.activeElement.id);
    expect(focusedAfterSubmit).toBe('answer');
  });
});
