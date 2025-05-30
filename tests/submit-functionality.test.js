import test from 'node:test';
import assert from 'node:assert/strict';
import { resultIsCorrect } from '../math-utils.js';
import { TIMES } from '../constants.js';

test('resultIsCorrect properly validates math problems', () => {
  // Test with various inputs
  const testCases = [
    { input: { factor1: 5, factor2: 7, operator: TIMES, answer: 35 }, expected: true },
    { input: { factor1: 5, factor2: 7, operator: TIMES, answer: 30 }, expected: false },
    { input: { factor1: 0, factor2: 9, operator: TIMES, answer: 0 }, expected: true },
    { input: { factor1: 10, factor2: 10, operator: TIMES, answer: 100 }, expected: true },
    { input: { factor1: 3, factor2: 6, operator: TIMES, answer: 19 }, expected: false }
  ];

  testCases.forEach(tc => {
    const { input, expected } = tc;
    const result = resultIsCorrect(input);
    assert.equal(
      result, 
      expected, 
      `${input.factor1} ${input.operator} ${input.factor2} = ${input.answer} should be ${expected ? 'correct' : 'incorrect'}`
    );
  });
});

// Skip this test since it's already tested in math-utils.test.js
// and we want to avoid dynamic imports for simplicity
