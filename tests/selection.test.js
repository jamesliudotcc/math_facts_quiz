import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

const { createNewProblem, state, updateSelectedOperator } = await import('../model.js');
const { TIMES } = await import('../constants.js');

test('createNewProblem should prioritize overdue SRS problems', () => {
  localStorage.clear();
  state.selectedNumbers = [2, 3];
  state.selectedOperator = TIMES;
  
  // Set up one overdue problem
  const overdueKey = "2,3,×";
  state.problemStats = {
    [overdueKey]: {
      nextReview: Date.now() - 10000, // 10s ago
      interval: 1,
      easeFactor: 2.5,
      repetitions: 1
    },
    "2,2,×": {
      nextReview: Date.now() + 10000, // 10s in future
      interval: 1,
      easeFactor: 2.5,
      repetitions: 1
    }
  };
  
  const problem = createNewProblem();
  assert.strictEqual(problem.factor1, 2);
  assert.strictEqual(problem.factor2, 3);
});

test('createNewProblem should pick a new problem if nothing is due', () => {
  localStorage.clear();
  state.selectedNumbers = [5];
  state.selectedOperator = TIMES;
  
  // 5x5 is the only possible if only 5 is selected and we ignore allNumbers for a moment,
  // but generatePossibleProblems uses [1-10] x [5].
  
  state.problemStats = {}; // No stats yet
  
  const problem = createNewProblem();
  assert.ok(problem.factor1 >= 1 && problem.factor1 <= 10);
  assert.strictEqual(problem.factor2, 5);
});
