import { resultIsCorrect } from "./math-utils.js";
import { TIMES, DIVIDE } from "./constants.js"; // Added DIVIDE

/**
 * Generates all possible problem combinations using selected numbers.
 * For multiplication:
 * 1. number1 is 1-10 and number2 is a selected number
 * 2. number1 is a selected number, and number2 is 1-10
 * For division:
 * Iterates through all pairs of selectedNumbers (n1, n2).
 * If n1 is divisible by n2, creates a problem n1 / n2.
 * Also iterates with one number from 1-10 and other from selectedNumbers.
 * @param {number[]} selectedNumbers - The currently selected numbers
 * @param {import('./model').Operator} operator - The operator to use
 * @returns {import('./model').PossibleProblem[]} Array of possible problems
 */
export const generatePossibleProblems = (selectedNumbers, operator) => {
  /** @type {import('./model').PossibleProblem[]} */
  const problems = [];
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (operator === TIMES) {
    // Original logic for multiplication
    for (let i = 1; i <= 10; i++) {
      for (const num of selectedNumbers) {
        problems.push({ operator, number1: i, number2: num });
        if (i !== num) { // Avoid duplicate problems like 5x5 if 5 is selected
             problems.push({ operator, number1: num, number2: i });
        }
      }
    }
     // Add pairs from selectedNumbers only if not already covered
    for (const num1 of selectedNumbers) {
        for (const num2 of selectedNumbers) {
            // Check if this specific pair (or its reverse) was already added by the 1-10 loops
            // let found = false; // This variable is declared but not used, consider removing.
            // The following 'if' block seems to have its logic commented out or incomplete.
            // if (allNumbers.includes(num1) && allNumbers.includes(num2)) {
                 // If both are in 1-10, it's likely covered, but this simple check is not exhaustive
                 // A more robust check would be to see if problems.some(p => p.number1 === num1 && p.number2 === num2)
            // } else {
            //      problems.push({ operator, number1: num1, number2: num2 });
            // }
             if (!problems.find(p=> p.number1 === num1 && p.number2 === num2)) {
                 problems.push({ operator, number1: num1, number2: num2 });
             }
        }
    }


  } else if (operator === DIVIDE) {
    const generateDivisionProblemsForPairSet = (set1, set2) => {
      for (const n1 of set1) {
        for (const n2 of set2) {
          if (n2 === 0) continue; // Cannot divide by zero
          if (n1 % n2 === 0) {
            // n1 is the dividend, n2 is the divisor
            // Ensure quotient is not zero, and factor1 (n1) is greater or equal to factor2 (n2)
            // and quotient is >=1
            if (n1 / n2 >= 1) { // This also implies n1 >= n2 for positive n2
                 problems.push({ operator, number1: n1, number2: n2 });
            }
          }
        }
      }
    };

    // 1. Both numbers from selectedNumbers
    generateDivisionProblemsForPairSet(selectedNumbers, selectedNumbers);

    // 2. number1 from allNumbers (1-10), number2 from selectedNumbers
    generateDivisionProblemsForPairSet(allNumbers, selectedNumbers);

    // 3. number1 from selectedNumbers, number2 from allNumbers (1-10)
    generateDivisionProblemsForPairSet(selectedNumbers, allNumbers);
  }

  // Remove duplicate problems (e.g. 4/2 generated from allNumbers + selected and selected + selected)
  const uniqueProblems = problems.filter((problem, index, self) =>
    index === self.findIndex(p =>
      p.number1 === problem.number1 && p.number2 === problem.number2 && p.operator === problem.operator
    )
  );
  return uniqueProblems;
};

// Model state
export const state = {
  history: [],
  currentProblem: {
    factor1: 0,
    factor2: 0,
    operator: TIMES
  },
  selectedOperator: TIMES, // Added selectedOperator, initialized to TIMES
  possibleProblems: generatePossibleProblems([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], TIMES),
  selectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  feedback: null
};

/**
 * Gets a copy of the current state
 * @returns {Object} Current state
 */
export const getState = () => ({
  ...state,
  currentProblem: { ...state.currentProblem },
  selectedNumbers: [...state.selectedNumbers],
  history: [...state.history],
  selectedOperator: state.selectedOperator // Ensure this is copied
});

/**
 * Generates a new problem and updates the model
 * @returns {Object} New problem
 */
export const createNewProblem = () => {
  // Regenerate possible problems based on current selected numbers AND operator
  state.possibleProblems = generatePossibleProblems(state.selectedNumbers, state.selectedOperator);

  if (state.possibleProblems.length === 0) {
    // If no problems can be generated, set a default or error state
    state.currentProblem = {
      factor1: 0, // Or some indicator of no problem
      factor2: 0, // Or some indicator of no problem
      operator: state.selectedOperator // Use selected operator
    };
    // Potentially provide a default problem if none can be generated for division
    if (state.selectedOperator === DIVIDE) {
        // This is a fallback, ideally UI should prevent situations where no problems can be made.
        // For example, if selectedNumbers only contains {1, 2} and DIVIDE is chosen, 2/1 is possible.
        // If selectedNumbers is {7} and DIVIDE, no problem.
        // Fallback to a generic easy division problem or indicate no problem available.
        state.currentProblem = { factor1: 4, factor2: 2, operator: DIVIDE }; // Example placeholder
    }
    return { ...state.currentProblem };
  }

  const randomIndex = Math.floor(Math.random() * state.possibleProblems.length);
  const chosenProblem = state.possibleProblems[randomIndex];

  state.currentProblem = {
    factor1: chosenProblem.number1,
    factor2: chosenProblem.number2,
    operator: chosenProblem.operator // This should align with state.selectedOperator
  };

  return { ...state.currentProblem };
};

/**
 * Processes an answer submission
 * @param {number} answer - The user's answer
 * @returns {Object} Result of the submission including feedback
 */
export const submitAnswer = (answer) => {
  const result = {
    factor1: state.currentProblem.factor1,
    factor2: state.currentProblem.factor2,
    operator: state.currentProblem.operator,
    answer: answer,
    time: Date.now(),
  };

  const isCorrect = resultIsCorrect(result);
  state.feedback = isCorrect ? 'correct' : 'incorrect';
  state.history.push(result);

  return {
    result,
    isCorrect,
    feedback: state.feedback
  };
};

/**
 * Clears the feedback state
 */
export const clearFeedback = () => {
  state.feedback = null;
};

/**
 * Updates the selected numbers
 * @param {number} number - The number to toggle
 * @param {boolean} selected - Whether the number is selected
 * @returns {number[]} The updated array of selected numbers
 */
export const updateSelectedNumber = (number, selected) => {
  if (selected && !state.selectedNumbers.includes(number)) {
    state.selectedNumbers.push(number);
  } else if (!selected) {
    const index = state.selectedNumbers.indexOf(number);
    if (index !== -1) {
      state.selectedNumbers.splice(index, 1);
    }
  }
  state.selectedNumbers.sort((a,b) => a-b); // Keep it sorted for consistency

  // Regenerate possible problems whenever selected numbers change, using current operator
  state.possibleProblems = generatePossibleProblems(state.selectedNumbers, state.selectedOperator);

  return [...state.selectedNumbers];
};

/**
 * Gets the currently selected numbers
 * @returns {number[]} Array of selected numbers
 */
export const getSelectedNumbers = () => {
  return [...state.selectedNumbers];
};

/**
 * Updates the selected operator
 * @param {import('./model').Operator} operator - The new operator to set
 */
export const updateSelectedOperator = (operator) => {
  state.selectedOperator = operator;
  // Regenerate possible problems when operator changes
  state.possibleProblems = generatePossibleProblems(state.selectedNumbers, state.selectedOperator);
  // The problem description mentions:
  // createNewProblem(); // This might be called by UI logic after settings are confirmed
  // For now, I will leave it commented out as per the note.
  // The UI should typically call createNewProblem() after settings are applied.
};

/**
 * Gets the currently selected operator
 * @returns {import('./model').Operator} The current operator
 */
export const getSelectedOperator = () => {
  return state.selectedOperator;
};
