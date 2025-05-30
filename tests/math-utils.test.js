import test from 'node:test';
import assert from 'node:assert/strict';
import { TIMES } from '../constants.js';

// Import the functions to test - we'll refactor these in the next step
import { generateProblem, resultIsCorrect } from '../math-utils.js';

test('generateProblem creates a problem with selected numbers', () => {
  // Test with a fixed set of selected numbers
  const selectedNumbers = new Set([1, 2, 3]);
  const problem = generateProblem(selectedNumbers);

  assert.equal(typeof problem.factor1, 'number');
  assert.equal(typeof problem.factor2, 'number');
  assert.equal(problem.operator, TIMES);
  assert.ok(selectedNumbers.has(problem.factor1));
  assert.ok(selectedNumbers.has(problem.factor2));
});

test('generateProblem handles empty set of selected numbers', () => {
  const selectedNumbers = new Set([]);
  const problem = generateProblem(selectedNumbers);

  assert.deepEqual(problem, {
    factor1: 0,
    factor2: 0,
    operator: TIMES
  });
});

test('resultIsCorrect validates correct multiplication', () => {
  const result = {
    factor1: 7,
    factor2: 6,
    operator: TIMES,
    answer: 42
  };

  assert.ok(resultIsCorrect(result));
});

test('resultIsCorrect identifies incorrect multiplication', () => {
  const result = {
    factor1: 7,
    factor2: 6,
    operator: TIMES,
    answer: 41
  };

  assert.ok(!resultIsCorrect(result));
});
