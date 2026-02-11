import { TIMES, DIVIDE } from "./constants.js"; // Import DIVIDE

/**
 * @typedef {import('./model').Operator} Operator
 */

/**
 * @typedef {Object} Problem
 * @property {number} factor1 - The first factor of the problem
 * @property {number} factor2 - The second factor of the problem
 * @property {Operator} operator - The mathematical operator (e.g., '×', '÷')
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
 * Generates a problem based on the selected numbers and operator.
 * Note: This function provides a basic way to generate a single problem.
 * For more controlled and comprehensive problem set generation (especially for division),
 * refer to `generatePossibleProblems` in `model.js`.
 * @param {number[]} selectedNumbers - Array of numbers to use for problem generation
 * @param {Operator} [operator=TIMES] - The operator to use (default: TIMES)
 * @returns {Problem} A problem object with factor1, factor2, and operator
 */
export const generateProblem = (selectedNumbers, operator = TIMES) => {
    if (selectedNumbers.length === 0) {
        // If no numbers are selected, return a default problem based on the operator
        if (operator === DIVIDE) {
            return { factor1: 4, factor2: 2, operator: DIVIDE }; // Default division
        }
        return { factor1: 1, factor2: 1, operator: TIMES }; // Default multiplication
    }

    let factor1, factor2;

    if (operator === DIVIDE) {
        // Attempt to find a valid division problem, try a few times
        // This is a simplistic approach for this standalone function.
        // `model.js/generatePossibleProblems` has more robust logic.
        let attempts = 0;
        const maxAttempts = 20; // Try to find a divisible pair
        do {
            const randomIndex1 = Math.floor(Math.random() * selectedNumbers.length);
            const randomIndex2 = Math.floor(Math.random() * selectedNumbers.length);
            factor1 = selectedNumbers[randomIndex1];
            factor2 = selectedNumbers[randomIndex2];
            attempts++;
            // Ensure factor2 is not zero and factor1 is divisible by factor2, and quotient >= 1 (factor1 >= factor2)
        } while (attempts < maxAttempts && (factor2 === 0 || factor1 % factor2 !== 0 || factor1 < factor2));

        // If no valid pair found after attempts, return a default or indicate error
        if (factor2 === 0 || factor1 % factor2 !== 0 || factor1 < factor2) {
            // Fallback to a known good division problem or default
            // This case should be rare if selectedNumbers is diverse and contains suitable pairs
            return { factor1: 4, factor2: 2, operator: DIVIDE };
        }
    } else { // For TIMES or any other future operators by default
        const randomIndex1 = Math.floor(Math.random() * selectedNumbers.length);
        const randomIndex2 = Math.floor(Math.random() * selectedNumbers.length);
        factor1 = selectedNumbers[randomIndex1];
        factor2 = selectedNumbers[randomIndex2];
    }

    return {
        factor1,
        factor2,
        operator,
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
    } else if (result.operator === DIVIDE) {
        // Ensure factor2 is not zero before division, though problem generation should prevent this.
        // Also ensure it is an integer division, as we only expect integer answers for math facts.
        if (result.factor2 === 0 || result.factor1 % result.factor2 !== 0) {
            return false;
        }
        return result.answer === result.factor1 / result.factor2;
    }
    return false; // Default for unknown operators
};
