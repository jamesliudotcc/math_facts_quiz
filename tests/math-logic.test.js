import test from 'node:test';
import assert from 'node:assert/strict';
import { TIMES } from '../constants.js';
import { generateProblem, resultIsCorrect } from '../math-utils.js';

test('generateProblem returns different problems on multiple calls', () => {
  // Using a fixed set with multiple numbers to test randomization
  const selectedNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Generate multiple problems
  const problems = [];
  for (let i = 0; i < 10; i++) {
    problems.push(generateProblem(selectedNumbers));
  }

  // Check if at least some problems are different (randomization works)
  // We convert problems to strings for easy comparison
  const uniqueProblems = new Set(problems.map(p => `${p.factor1},${p.factor2}`));

  // With 10 random generations from 10 numbers, we should get at least 2 unique problems
  assert.ok(uniqueProblems.size > 1, 'Problem generation should be randomized');
});

test('resultIsCorrect works with various multiplication problems', () => {
  const testCases = [
    { factor1: 1, factor2: 1, answer: 1, expected: true },
    { factor1: 0, factor2: 5, answer: 0, expected: true },
    { factor1: 9, factor2: 9, answer: 81, expected: true },
    { factor1: 7, factor2: 8, answer: 55, expected: false }, // wrong answer
    { factor1: 3, factor2: 6, answer: 18, expected: true },
    { factor1: 10, factor2: 10, answer: 100, expected: true },
  ];

  for (const tc of testCases) {
    const result = {
      factor1: tc.factor1,
      factor2: tc.factor2,
      operator: TIMES,
      answer: tc.answer
    };

    assert.equal(
      resultIsCorrect(result), 
      tc.expected,
      `${tc.factor1} × ${tc.factor2} = ${tc.answer} should be ${tc.expected ? 'correct' : 'incorrect'}`
    );
  }
});
