import { TIMES } from "./constants.js";

/**
 * @typedef {Object} Problem
 * @property {number} factor1 - The first factor of the problem
 * @property {number} factor2 - The second factor of the problem
 * @property {string} operator - The mathematical operator (e.g., '×')
 */

/**
 * @typedef {Object} Result
 * @property {number} factor1 - The first factor of the problem
 * @property {number} factor2 - The second factor of the problem
 * @property {string} operator - The mathematical operator used
 * @property {number} answer - The user's answer to the problem
 * @property {number} [time] - Timestamp when the answer was submitted
 */

/**
 * Generates a multiplication problem based on the selected numbers
 * @param {Set<number>} selectedNumbers - Set of numbers to use for problem generation
 * @returns {Problem} A problem object with factor1, factor2, and operator
 */
export const generateProblem = (selectedNumbers) => {
    // Convert Set to Array for random selection
    const numbersArray = [...selectedNumbers];

    // Only generate problems if we have numbers to work with
    if (numbersArray.length === 0) {
        return {
            factor1: 0,
            factor2: 0,
            operator: TIMES
        };
    }

    // Randomly select numbers from the selectedNumbers
    const randomIndex1 = Math.floor(Math.random() * numbersArray.length);
    const randomIndex2 = Math.floor(Math.random() * numbersArray.length);

    return {
        factor1: numbersArray[randomIndex1],
        factor2: numbersArray[randomIndex2],
        operator: TIMES,
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
