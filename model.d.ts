import { Problem, Result } from './math-utils';

/**
 * Operator type
 */
export type Operator = "×" | "÷";

/**
 * Represents a possible problem type with its operator and available numbers
 */
export interface PossibleProblem {
  operator: Operator;
  number1: number;
  number2: number;
}

export interface ModelState {
  history: Result[];
  currentProblem: Problem;
  selectedNumbers: number[];
  feedback: 'correct' | 'incorrect' | null;
  possibleProblems: PossibleProblem[];
  selectedOperator: Operator;
}

export interface SubmitResult {
  result: Result;
  isCorrect: boolean;
  feedback: 'correct' | 'incorrect';
}

/**
 * The current state of the model
 */
export const state: ModelState;

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
export function updateSelectedNumber(number: number, selected: boolean): number[];

/**
 * Gets the currently selected numbers
 */
export function getSelectedNumbers(): number[];

/**
 * Updates the selected operator
 */
export function updateSelectedOperator(operator: Operator): void;

/**
 * Gets the currently selected operator
 */
export function getSelectedOperator(): Operator;

/**
 * Generates all possible problem combinations using selected numbers
 * @param selectedNumbers - The currently selected numbers
 * @param operator - The operator to use (default: TIMES)
 */
export function generatePossibleProblems(selectedNumbers: number[], operator?: Operator): PossibleProblem[];
