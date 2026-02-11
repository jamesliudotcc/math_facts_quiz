import { resultIsCorrect } from "./math-utils.js";
import { TIMES, DIVIDE } from "./constants.js";
import { updateSRSStats } from "./srs.js";

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
const DEFAULT_SELECTED_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const loadState = () => {
  const defaultState = {
    history: [],
    currentProblem: {
      factor1: 0,
      factor2: 0,
      operator: TIMES
    },
    selectedOperator: TIMES,
    selectedNumbers: [...DEFAULT_SELECTED_NUMBERS],
    feedback: null,
    problemStats: {}, // Key: "num1,num2,op", Value: { nextReview, interval, easeFactor, repetitions }
    startTime: 0
  };

  try {
    const saved = localStorage.getItem('mathFactsState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        // Ensure we don't overwrite the entire state if some keys are missing
        selectedNumbers: parsed.selectedNumbers || defaultState.selectedNumbers,
        selectedOperator: parsed.selectedOperator || defaultState.selectedOperator,
        problemStats: parsed.problemStats || defaultState.problemStats,
        history: [] // Reset history on load for now
      };
    }
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
  }
  return defaultState;
};

export const state = loadState();
state.possibleProblems = generatePossibleProblems(state.selectedNumbers, state.selectedOperator);

export const saveState = () => {
  try {
    const toSave = {
      selectedNumbers: state.selectedNumbers,
      selectedOperator: state.selectedOperator,
      problemStats: state.problemStats
    };
    localStorage.setItem('mathFactsState', JSON.stringify(toSave));
  } catch (e) {
    console.warn('Could not save state to localStorage', e);
  }
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
  selectedOperator: state.selectedOperator,
  problemStats: { ...state.problemStats }
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
      factor1: 0,
      factor2: 0,
      operator: state.selectedOperator
    };
    if (state.selectedOperator === DIVIDE) {
        state.currentProblem = { factor1: 4, factor2: 2, operator: DIVIDE };
    }
    return { ...state.currentProblem };
  }

  // SRS Selection Logic
  const now = Date.now();
  const opSymbol = state.selectedOperator;
  
  // 1. Find overdue problems from the possible problems pool
  const overdue = state.possibleProblems.filter(p => {
    const key = `${p.number1},${p.number2},${opSymbol}`;
    const stats = state.problemStats[key];
    return stats && stats.nextReview <= now;
  });

  // 2. Find new problems (never seen)
  const newProblems = state.possibleProblems.filter(p => {
    const key = `${p.number1},${p.number2},${opSymbol}`;
    return !state.problemStats[key];
  });

  let chosenProblem;

  if (overdue.length > 0) {
    // Pick the most overdue one
    overdue.sort((a, b) => {
      const keyA = `${a.number1},${a.number2},${opSymbol}`;
      const keyB = `${b.number1},${b.number2},${opSymbol}`;
      return state.problemStats[keyA].nextReview - state.problemStats[keyB].nextReview;
    });
    chosenProblem = overdue[0];
  } else if (newProblems.length > 0) {
    // Pick a random new problem
    const randomIndex = Math.floor(Math.random() * newProblems.length);
    chosenProblem = newProblems[randomIndex];
  } else {
    // Everything has been seen and nothing is due.
    // Pick the one that is closest to being due (or most overdue if we missed it somehow)
    const allStats = state.possibleProblems.map(p => {
      const key = `${p.number1},${p.number2},${opSymbol}`;
      return { problem: p, stats: state.problemStats[key] };
    });
    allStats.sort((a, b) => a.stats.nextReview - b.stats.nextReview);
    chosenProblem = allStats[0].problem;
  }

  state.currentProblem = {
    factor1: chosenProblem.number1,
    factor2: chosenProblem.number2,
    operator: chosenProblem.operator
  };

  state.startTime = Date.now();

  return { ...state.currentProblem };
};

/**
 * Processes an answer submission
 * @param {number} answer - The user's answer
 * @returns {Object} Result of the submission including feedback
 */
export const submitAnswer = (answer) => {
  const now = Date.now();
  const responseTime = now - state.startTime;
  
  const result = {
    factor1: state.currentProblem.factor1,
    factor2: state.currentProblem.factor2,
    operator: state.currentProblem.operator,
    answer: answer,
    time: now,
    responseTime: responseTime
  };

  const isCorrect = resultIsCorrect(result);
  
  // Update SRS stats
  const problemKey = `${result.factor1},${result.factor2},${result.operator}`;
  state.problemStats = updateSRSStats(state.problemStats, problemKey, isCorrect, responseTime);
  saveState();

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
  saveState();

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
  saveState();
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

/**
 * Resets all SRS progress
 */
export const resetProgress = () => {
  state.problemStats = {};
  state.history = [];
  saveState();
};
