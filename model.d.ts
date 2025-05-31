import { Problem, Result } from './math-utils';

export interface ModelState {
  history: Result[];
  currentProblem: Problem;
  selectedNumbers: Set<number>;
  feedback: 'correct' | 'incorrect' | null;
}

export interface SubmitResult {
  result: Result;
  isCorrect: boolean;
  feedback: 'correct' | 'incorrect';
}

/**
 * Gets a copy of the current state
 */
export function getState(): ModelState;

/**
 * Generates a new problem and updates the model
 */
export function createNewProblem(): Problem;

/**
 * Processes an answer submission
 */
export function submitAnswer(answer: number): SubmitResult;

/**
 * Clears the feedback state
 */
export function clearFeedback(): void;

/**
 * Updates the selected numbers
 */
export function updateSelectedNumber(number: number, selected: boolean): Set<number>;

/**
 * Gets the currently selected numbers
 */
export function getSelectedNumbers(): Set<number>;
