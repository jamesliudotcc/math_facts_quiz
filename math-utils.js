import { TIMES } from "./constants.js";

/**
 * Generates a multiplication problem based on the selected numbers
 * @param {Set<number>} selectedNumbers - Set of numbers to use for problem generation
 * @returns {Object} A problem object with factor1, factor2, and operator
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
 * @param {Object} result - The result object containing the problem and answer
 * @returns {boolean} Whether the answer is correct
 */
export const resultIsCorrect = (result) => {
    if (result.operator === TIMES) {
        return result.answer === result.factor1 * result.factor2;
    }
    return false;
};
