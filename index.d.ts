// Type definitions for Math Facts Quiz

/**
 * Problem interface
 */
interface Problem {
  factor1: number;
  factor2: number;
  operator: string;
}

/**
 * Result interface for quiz answers
 */
interface Result extends Problem {
  answer: number;
  time: number;
}

/**
 * Generates a multiplication problem
 */
declare function generateProblem(selectedNumbers: Set<number>): Problem;

/**
 * Checks if the result is correct
 */
declare function resultIsCorrect(result: Result): boolean;

/**
 * DOM element types extended from native elements
 */
interface MathQuizElements {
  factor1: HTMLElement;
  factor2: HTMLElement;
  operator: HTMLElement;
  answer: HTMLInputElement;
  quiz: HTMLFormElement;
  correct_or_incorrect: HTMLElement;
  'settings-dialog': HTMLDialogElement;
  'settings-button': HTMLButtonElement;
  'settings-form': HTMLFormElement;
}

/**
 * Type guard for input elements
 */
declare function isInputElement(element: HTMLElement | null): element is HTMLInputElement;
