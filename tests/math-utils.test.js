// Path: tests/math-utils.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

import { TIMES, DIVIDE } from '../constants.js';
import { generateProblem, resultIsCorrect } from '../math-utils.js';

test('generateProblem creates a problem with selected numbers (TIMES)', () => {
  const selectedNumbers = [1, 2, 3];
  const problem = generateProblem(selectedNumbers, TIMES);

  assert.equal(typeof problem.factor1, 'number');
  assert.equal(typeof problem.factor2, 'number');
  assert.equal(problem.operator, TIMES);
  assert.ok(selectedNumbers.includes(problem.factor1));
  assert.ok(selectedNumbers.includes(problem.factor2));
});

test('generateProblem handles empty set of selected numbers (TIMES)', () => {
  const selectedNumbers = [];
  const problem = generateProblem(selectedNumbers, TIMES);
  // As per updated math-utils.js, it should return a default problem for the operator
  assert.deepStrictEqual(problem, { factor1: 1, factor2: 1, operator: TIMES });
});

test('generateProblem creates a problem with selected numbers (DIVIDE)', () => {
  const selectedNumbers = [2, 4, 8];
  const problem = generateProblem(selectedNumbers, DIVIDE);

  assert.strictEqual(problem.operator, DIVIDE);
  // If problem is default 4/2, factors might not be in selectedNumbers if selectedNumbers is e.g. [5,7]
  // or if the random attempts in generateProblem didn't find a valid pair from selectedNumbers.
  if (!(problem.factor1 === 4 && problem.factor2 === 2)) {
    assert.ok(selectedNumbers.includes(problem.factor1), `factor1 (${problem.factor1}) should be from selectedNumbers or it's a default`);
    assert.ok(selectedNumbers.includes(problem.factor2), `factor2 (${problem.factor2}) should be from selectedNumbers or it's a default`);
  }
  assert.notStrictEqual(problem.factor2, 0, "factor2 should not be zero for division");
  assert.strictEqual(problem.factor1 % problem.factor2, 0, `factor1 (${problem.factor1}) should be divisible by factor2 (${problem.factor2})`);
  assert.ok(problem.factor1 / problem.factor2 >= 1, `quotient (${problem.factor1}/${problem.factor2}) should be >= 1`);
});

test('generateProblem handles empty set of selected numbers (DIVIDE)', () => {
  const selectedNumbers = [];
  const problem = generateProblem(selectedNumbers, DIVIDE);
  assert.deepStrictEqual(problem, { factor1: 4, factor2: 2, operator: DIVIDE });
});

test('generateProblem attempts to find valid division problems from a suitable set (not just default)', () => {
    const selectedNumbers = [3, 6, 12, 18, 24, 30];
    let validNonDefaultFound = 0;
    for (let i=0; i < 50; i++) { // Increased attempts to raise probability of non-default
        const problem = generateProblem(selectedNumbers, DIVIDE);
        // Check if it's a valid problem derived from selectedNumbers
        if (problem.factor2 !== 0 &&
            problem.factor1 % problem.factor2 === 0 &&
            problem.factor1 / problem.factor2 >=1 &&
            selectedNumbers.includes(problem.factor1) &&
            selectedNumbers.includes(problem.factor2)) {
            validNonDefaultFound++;
        }
    }
    // This test can be flaky due to randomness. The goal is to see if it *can* generate non-defaults.
    assert.ok(validNonDefaultFound > 0, "Should be able to generate some valid division problems from suitable numbers, beyond the default 4/2.");
});

test('generateProblem returns different problems on multiple calls (TIMES)', () => {
  const selectedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const problems = new Set(); // Use a Set to store string representations of problems
  for (let i = 0; i < 30; i++) { // Increased loop for better chance of variety
    const p = generateProblem(selectedNumbers, TIMES);
    problems.add(`${p.factor1},${p.factor2}`);
  }
  assert.ok(problems.size > 1, `Problem generation for TIMES should be randomized. Got ${problems.size} unique problems.`);
});

test('generateProblem returns different problems on multiple calls (DIVIDE)', () => {
  const selectedNumbers = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36]; // Larger set for more pairs
  const generatedProblems = new Set();
  let defaultCount = 0;

  for (let i = 0; i < 100; i++) { // More iterations
     const problem = generateProblem(selectedNumbers, DIVIDE);
     if (problem.factor1 === 4 && problem.factor2 === 2 && problem.operator === DIVIDE) {
         defaultCount++;
     }
     // Add to set only if it's a valid problem (as per generateProblem's own rules)
     if (problem.factor2 !== 0 && problem.factor1 % problem.factor2 === 0) {
        generatedProblems.add(`${problem.factor1}÷${problem.factor2}`);
     }
  }

  // Check if more than one unique problem was generated, excluding the default if it was the only one.
  if (selectedNumbers.length > 0) {
    // If all 100 were the default, something is wrong, or the selectedNumbers are very restrictive.
    // Given the large selectedNumbers array, we expect non-default problems.
    assert.ok(generatedProblems.size > 1, `Problem generation for DIVIDE should show randomization. Found ${generatedProblems.size} unique problems. Default count: ${defaultCount}`);
  } else if (selectedNumbers.length === 0) {
    assert.strictEqual(generatedProblems.size, 1, 'For empty selectedNumbers and DIVIDE, only one default problem (4÷2) is expected.');
    assert.ok(generatedProblems.has("4÷2"), "The single problem should be 4/2");
  }
});


test('resultIsCorrect validates correct multiplication', () => {
  const result = { factor1: 7, factor2: 6, operator: TIMES, answer: 42 };
  assert.strictEqual(resultIsCorrect(result), true);
});

test('resultIsCorrect identifies incorrect multiplication', () => {
  const result = { factor1: 7, factor2: 6, operator: TIMES, answer: 41 };
  assert.strictEqual(resultIsCorrect(result), false);
});

test('resultIsCorrect validates correct division', () => {
  const testCases = [
    { factor1: 8, factor2: 2, answer: 4, expected: true },
    { factor1: 9, factor2: 3, answer: 3, expected: true },
    { factor1: 10, factor2: 1, answer: 10, expected: true },
    { factor1: 7, factor2: 7, answer: 1, expected: true },
  ];
  for (const tc of testCases) {
    const result = { ...tc, operator: DIVIDE };
    assert.strictEqual(resultIsCorrect(result), tc.expected, `Division ${tc.factor1}/${tc.factor2}=${tc.answer}`);
  }
});

test('resultIsCorrect identifies incorrect division', () => {
  const testCases = [
    { factor1: 8, factor2: 2, answer: 3, expected: false },
    { factor1: 9, factor2: 3, answer: 2, expected: false },
    // Test case for non-integer result from division, which should be false as we expect integer answers
    { factor1: 5, factor2: 2, answer: 2.5, expected: false },
  ];
   for (const tc of testCases) {
    const result = { ...tc, operator: DIVIDE };
    assert.strictEqual(resultIsCorrect(result), tc.expected, `Incorrect Division ${tc.factor1}/${tc.factor2}=${tc.answer}`);
  }
});

test('resultIsCorrect handles division by zero', () => {
  // Problem generation should prevent factor2 = 0, but resultIsCorrect should still handle it robustly.
  const result = { factor1: 5, factor2: 0, operator: DIVIDE, answer: 1 };
  assert.strictEqual(resultIsCorrect(result), false, "Division by zero should be false");
});

test('resultIsCorrect returns false for unknown operator', () => {
  // Casting to any to bypass Operator type check for this specific test
  const result = /** @type {any} */ ({ factor1: 5, factor2: 1, operator: '+', answer: 5 });
  assert.strictEqual(resultIsCorrect(result), false, "Unknown operator should result in false");
});
