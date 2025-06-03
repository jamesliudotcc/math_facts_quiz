import { TIMES } from "./constants.js";

/**
 * @typedef {import('./model').Operator} Operator
 */

/**
 * @typedef {Object} Problem
 * @property {number} factor1 - The first factor of the problem
 * @property {number} factor2 - The second factor of the problem
 * @property {Operator} operator - The mathematical operator (e.g., '×')
 */

/**
 * @typedef {Object} Result
 * @property {number} factor1 - The first factor of the problem
 * @property {number} factor2 - The second factor of the problem
 * @property {Operator} operator - The mathematical operator used
 * @property {number} answer - The user's answer to the problem
 * @property {number} [time] - Timestamp when the answer was submitted
 */

/**
 * Generates a problem based on the selected numbers and operator
 * @param {number[]} selectedNumbers - Array of numbers to use for problem generation
 * @param {Operator} [operator=TIMES] - The operator to use (default: TIMES)
 * @returns {Problem} A problem object with factor1, factor2, and operator
 */
export const generateProblem = (selectedNumbers, operator = TIMES) => {
    // Only generate problems if we have numbers to work with
    if (selectedNumbers.length === 0) {
        return {
            factor1: 0,
            factor2: 0,
            operator: TIMES
        };
    }

    // Randomly select numbers from the selectedNumbers
    const randomIndex1 = Math.floor(Math.random() * selectedNumbers.length);
    const randomIndex2 = Math.floor(Math.random() * selectedNumbers.length);

    return {
        factor1: selectedNumbers[randomIndex1],
        factor2: selectedNumbers[randomIndex2],
        operator, // Use the provided operator (or default TIMES)
    };
};

/**
 * Checks if the provided answer is correct for the given problem
 * @param {Result} result - The result object containing the problem and answer
 * @returns {boolean} Whether the answer is correct
 */
export const resultIsCorrect = (result) => {
    if (result.operator === TIMES) {
        return result.answer === result.factor1 * result.factor2;
    }
    return false;
};
