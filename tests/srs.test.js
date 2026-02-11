import test from 'node:test';
import assert from 'node:assert/strict';
import { updateSRSStats } from '../srs.js';

test('New problem should initialize with standard SM-2 values', () => {
  const problemKey = "2,3,×";
  const stats = {};
  const isCorrect = true;
  const responseTime = 1000; // 1 second
  
  const newStats = updateSRSStats(stats, problemKey, isCorrect, responseTime);
  const problem = newStats[problemKey];
  
  assert.strictEqual(problem.repetitions, 1);
  assert.strictEqual(problem.interval, 1);
  assert.ok(problem.nextReview > Date.now());
});

test('Incorrect answer should reset repetitions and interval', () => {
  const problemKey = "2,3,×";
  const stats = {
    [problemKey]: {
      repetitions: 5,
      interval: 16,
      easeFactor: 2.5,
      nextReview: Date.now() - 1000
    }
  };
  
  const newStats = updateSRSStats(stats, problemKey, false, 1000);
  const problem = newStats[problemKey];
  
  assert.strictEqual(problem.repetitions, 0);
  assert.strictEqual(problem.interval, 1);
});

test('Correct and fast answer should increase interval', () => {
  const problemKey = "2,3,×";
  const stats = {
    [problemKey]: {
      repetitions: 1,
      interval: 1,
      easeFactor: 2.5,
      nextReview: Date.now() - 1000
    }
  };
  
  // SM-2: if repetitions=1 -> interval=6
  const newStats = updateSRSStats(stats, problemKey, true, 1000);
  const problem = newStats[problemKey];
  
  assert.strictEqual(problem.repetitions, 2);
  assert.strictEqual(problem.interval, 6);
});
