// Import from model.js and constants.js
import {
    clearFeedback, createNewProblem, getSelectedNumbers, state, submitAnswer, updateSelectedNumber,
    updateSelectedOperator, getSelectedOperator // Added new imports
} from "./model.js";
import { TIMES, DIVIDE } from "./constants.js"; // Added new imports

/**
 * Displays a new math problem on the page
 * @returns {void}
 */
const displayProblem = () => {
    const problem = createNewProblem();

    // Set up update by grabbing the elements from the DOM
    const factor1Element = document.getElementById("factor1");
    const operatorElement = document.getElementById("operator");
    const factor2Element = document.getElementById("factor2");

    // Update the elements with the new problem data
    if (factor1Element) factor1Element.textContent = String(problem.factor1);
    if (operatorElement) operatorElement.textContent = problem.operator; // This should now correctly show ÷ or ×
    if (factor2Element) factor2Element.textContent = String(problem.factor2);
}

// On page load, generate a problem and display it
window.addEventListener("load", () => {
    displayProblem();
    // set focus on the input
    const answerInput = document.getElementById("answer");
    if (answerInput) answerInput.focus();
});

/** @type {HTMLElement | null} */
const popover = document.getElementById("correct_or_incorrect");

const handleAnswerSubmission = (answerInput, popover) => {
  const value = parseInt(answerInput.value);
  const { isCorrect } = submitAnswer(value);

  if (popover) {
    popover.textContent = isCorrect ? "👍" : "❌";
    popover.classList.toggle("show");
    setTimeout(() => {
      popover.classList.toggle("show");
      clearFeedback();
    }, 1000);
  }

  answerInput.value = "";
  displayProblem();
  answerInput.focus();
};

const quizForm = document.getElementById("quiz");
if (quizForm) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answerElement = document.getElementById("answer");
    if (!(answerElement instanceof HTMLInputElement)) {
      return;
    }
    handleAnswerSubmission(answerElement, popover);
    console.log(state);
  });
}

const answerInput = document.getElementById("answer");
if (answerInput) {
  answerInput.addEventListener("blur", (/** @type {FocusEvent} */ event) => {
    setTimeout(() => {
        /** @type {HTMLInputElement} */
        const target = /** @type {HTMLInputElement} */ (event.target);
        target.focus();
    }, 100);
  });
}

const dialogElement = document.getElementById("settings-dialog");
const buttonElement = document.getElementById("settings-button");
const formElement = document.getElementById("settings-form");

const settingsDialog = dialogElement instanceof HTMLDialogElement ? dialogElement : null;
const settingsButton = buttonElement instanceof HTMLButtonElement ? buttonElement : null;
const settingsForm = formElement instanceof HTMLFormElement ? formElement : null;

// Get radio buttons for operations
const opMultiplyRadio = document.getElementById("op-multiply");
const opDivideRadio = document.getElementById("op-divide");

if (settingsButton && settingsDialog) {
  settingsButton.addEventListener("click", () => {
    // Update number checkboxes to match the current model state
    const selectedNumbers = getSelectedNumbers();
    for (let i = 1; i <= 10; i += 1) {
        const checkboxElement = document.getElementById(`_${i}`);
        if (checkboxElement instanceof HTMLInputElement) {
            checkboxElement.checked = selectedNumbers.includes(i);
        }
    }

    // Update operation radio buttons to match current model state
    const currentOperator = getSelectedOperator();
    if (opMultiplyRadio instanceof HTMLInputElement && opDivideRadio instanceof HTMLInputElement) {
        if (currentOperator === TIMES) {
            opMultiplyRadio.checked = true;
        } else if (currentOperator === DIVIDE) {
            opDivideRadio.checked = true;
        }
    }

    if (!settingsDialog.open) {
      settingsDialog.showModal();
    }
  });
}

// Event listeners for operation radio buttons
if (opMultiplyRadio instanceof HTMLInputElement) {
    opMultiplyRadio.addEventListener("change", () => {
        if (opMultiplyRadio.checked) {
            updateSelectedOperator(TIMES);
            console.log("Selected operator:", TIMES, state);
        }
    });
}

if (opDivideRadio instanceof HTMLInputElement) {
    opDivideRadio.addEventListener("change", () => {
        if (opDivideRadio.checked) {
            updateSelectedOperator(DIVIDE);
            console.log("Selected operator:", DIVIDE, state);
        }
    });
}


if (settingsForm) {
  settingsForm.addEventListener("submit", () => {
      displayProblem(); // This will now use the potentially updated operator
  });
}

if (settingsDialog) {
  settingsDialog.addEventListener("click", (event) => {
    if (event.target === settingsDialog) {
        settingsDialog.close();
    }
  });
  settingsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    settingsDialog.close();
  });
}

if (settingsDialog) {
  settingsDialog.addEventListener("close", () => {
    const answerInput = document.getElementById("answer");
    if (answerInput) {
      setTimeout(() => {
        answerInput.focus();
      }, 0);
    }
  });
}

for (let i = 1; i <= 10; i += 1) {
    const checkboxId = `_${i}`;
    const checkboxElement = document.getElementById(checkboxId);

    if (checkboxElement instanceof HTMLInputElement) {
      const checkbox = checkboxElement;
      // const selectedNumbers = getSelectedNumbers(); // Initial state from original prompt, moved down
      // checkbox.checked = selectedNumbers.includes(i); // Moved down

      // Initialize checkbox state based on model when settings dialog is populated or script initially runs
      // For initial load of the page, this loop runs and sets checkbox states.
      // When settings dialog is opened, the state is re-synced anyway.
      checkbox.checked = getSelectedNumbers().includes(i);


      checkbox.addEventListener("change", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
          updateSelectedNumber(i, target.checked);
          console.log('Current state (number change):', state);
        }
      });
    }
};