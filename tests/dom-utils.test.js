import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDOM } from './utils.js';

test('form has required elements', async () => {
  const dom = await setupDOM();
  const { document } = dom.window;

  // Check that important elements exist
  const form = document.getElementById('quiz');
  const factor1 = document.getElementById('factor1');
  const factor2 = document.getElementById('factor2');
  const answerInput = document.getElementById('answer');
  const submitButton = document.getElementById('submitAnswer');

  assert.ok(form, 'Form should exist');
  assert.ok(factor1, 'Factor1 element should exist');
  assert.ok(factor2, 'Factor2 element should exist');
  assert.ok(answerInput, 'Answer input should exist');
  assert.ok(submitButton, 'Submit button should exist');

  // Verify button exists inside the form
  assert.ok(form.contains(submitButton), 'Submit button should be inside the form');
});

test('checkboxes for numbers exist in the document', async () => {
  const dom = await setupDOM();
  const { document } = dom.window;

  // Check that all number checkboxes exist
  for (let i = 1; i <= 10; i++) {
    const checkbox = document.getElementById(`_${i}`);
    assert.ok(checkbox, `Checkbox for number ${i} should exist`);
    assert.equal(checkbox.type, 'checkbox', `Element _${i} should be a checkbox`);
  }
});
