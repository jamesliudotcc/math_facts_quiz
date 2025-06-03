import { Operator } from './model';

/**
 * Result interface for a completed problem
 */
export interface Result {
  factor1: number;
  factor2: number;
  operator: Operator;
  answer: number;
  time: number;
}

/**
 * Problem interface
 */
export interface Problem {
  factor1: number;
  factor2: number;
  operator: Operator;
}

/**
 * Generates a random math problem
 * @param selectedNumbers - Set of available numbers to use
 * @param operator - The operator to use for the problem
 */
export function generateProblem(selectedNumbers: Set<number>, operator?: Operator): Problem;

/**
 * Checks if a result is correct
 * @param result - The result to check
 */
export function resultIsCorrect(result: Result): boolean;
