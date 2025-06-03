import { resultIsCorrect } from "./math-utils.js";
import { TIMES } from "./constants.js";

/**
 * Generates all possible problem combinations using selected numbers
 * Creates problems where:
 * 1. number1 is 1-10 and number2 is a selected number
 * 2. number1 is a selected number, and number2 is 1-10
 * @param {number[]} selectedNumbers - The currently selected numbers
 * @param {import('./model').Operator} operator - The operator to use (default: TIMES)
 * @returns {import('./model').PossibleProblem[]} Array of possible problems
 */
export const generatePossibleProblems = (selectedNumbers, operator = TIMES) => {
  /** @type {import('./model').PossibleProblem[]} */
  const problems = [];

  // Generate problems where number1 is 1-10 and number2 is from selected numbers
  for (let i = 1; i <= 10; i++) {
    for (const num of selectedNumbers) {
      problems.push({
        operator,
        number1: i,
        number2: num
      });
    }
  }

  // Generate problems where number1 is from selected numbers and number2 is 1-10
  for (const num of selectedNumbers) {
    for (let i = 1; i <= 10; i++) {
      problems.push({
        operator,
        number1: num,
        number2: i
      });
    }
  }

  return problems;
};

// Model state
export const state = {
  history: [],
  currentProblem: {
    factor1: 0,
    factor2: 0,
    operator: /** @type {import('./model').Operator} */ (TIMES)
  },
  // Initialize with problems using all numbers 1-10
  possibleProblems: generatePossibleProblems([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], TIMES),
  selectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  feedback: null // 'correct', 'incorrect', or null
};

/**
 * Gets a copy of the current state
 * @returns {Object} Current state
 */
export const getState = () => ({
  ...state,
  currentProblem: { ...state.currentProblem },
  selectedNumbers: [...state.selectedNumbers],
  history: [...state.history]
});

/**
 * Generates a new problem and updates the model
 * @returns {Object} New problem
 */
export const createNewProblem = () => {
  // Generate all possible problems based on current selected numbers
  state.possibleProblems = generatePossibleProblems(state.selectedNumbers, TIMES);

  // If there are no possible problems, return a default problem
  if (state.possibleProblems.length === 0) {
    state.currentProblem = {
      factor1: 0,
      factor2: 0,
      operator: TIMES
    };
    return { ...state.currentProblem };
  }

  // Choose a random problem from the possible problems
  const randomIndex = Math.floor(Math.random() * state.possibleProblems.length);
  const chosenProblem = state.possibleProblems[randomIndex];

  // Update current problem
  state.currentProblem = {
    factor1: chosenProblem.number1,
    factor2: chosenProblem.number2,
    operator: chosenProblem.operator
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

  // Regenerate possible problems whenever selected numbers change
  state.possibleProblems = generatePossibleProblems(state.selectedNumbers, TIMES);

  return [...state.selectedNumbers];
};

/**
 * Gets the currently selected numbers
 * @returns {number[]} Array of selected numbers
 */
export const getSelectedNumbers = () => {
  return [...state.selectedNumbers];
};
