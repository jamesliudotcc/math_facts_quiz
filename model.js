import { generateProblem, resultIsCorrect } from "./math-utils.js";

// Model state
const state = {
  history: [],
  currentProblem: {
    factor1: 0,
    factor2: 0,
    operator: "×"
  },
  selectedNumbers: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  feedback: null // 'correct', 'incorrect', or null
};

/**
 * Gets a copy of the current state
 * @returns {Object} Current state
 */
export const getState = () => ({
  ...state,
  currentProblem: { ...state.currentProblem },
  selectedNumbers: new Set(state.selectedNumbers),
  history: [...state.history]
});

/**
 * Generates a new problem and updates the model
 * @returns {Object} New problem
 */
export const createNewProblem = () => {
  state.currentProblem = generateProblem(state.selectedNumbers);
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
 */
export const updateSelectedNumber = (number, selected) => {
  if (selected) {
    state.selectedNumbers.add(number);
  } else {
    state.selectedNumbers.delete(number);
  }
  return new Set(state.selectedNumbers);
};

/**
 * Gets the currently selected numbers
 * @returns {Set<number>} Set of selected numbers
 */
export const getSelectedNumbers = () => {
  return new Set(state.selectedNumbers);
};
