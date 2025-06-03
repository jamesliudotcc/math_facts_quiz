// Import from model.js instead of directly using math-utils
import {clearFeedback, createNewProblem, getSelectedNumbers, state, submitAnswer, updateSelectedNumber} from "./model.js";

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
    if (operatorElement) operatorElement.textContent = problem.operator;
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

/**
 * Processes the user's answer submission and updates the UI with feedback
 * @param {HTMLInputElement} answerInput - The input element containing the user's answer
 * @param {HTMLElement} popover - The popover element used to display feedback
 * @returns {void}
 */
const handleAnswerSubmission = (answerInput, popover) => {
  const value = parseInt(answerInput.value);

  // Use the model to handle the answer submission
  const { isCorrect } = submitAnswer(value);

  // Update the UI based on result
  if (popover) {
    popover.textContent = isCorrect ? "👍" : "❌";
    popover.classList.toggle("show");
    setTimeout(() => {
      popover.classList.toggle("show");
      clearFeedback(); // Clear feedback state after showing it
    }, 1000);
  }

  // Clear the answer input and generate a new problem
  answerInput.value = "";
  displayProblem();

  // Focus back on the input field for better UX
  answerInput.focus();
};

// Handle form submission
const quizForm = document.getElementById("quiz");
if (quizForm) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answerElement = document.getElementById("answer");
    if (!(answerElement instanceof HTMLInputElement)) {
      return; // Exit if not found or wrong type
    }

    handleAnswerSubmission(answerElement, popover);

    console.log(state);
  });
}

// Add this after the existing event listeners
const answerInput = document.getElementById("answer");
if (answerInput) {
  answerInput.addEventListener("blur", (/** @type {FocusEvent} */ event) => {
    setTimeout(() => {
        /** @type {HTMLInputElement} */
        const target = /** @type {HTMLInputElement} */ (event.target);
        target.focus();
    }, 100); // 100 is milliseconds
  });
}

// Get dialog and button elements
const dialogElement = document.getElementById("settings-dialog");
const buttonElement = document.getElementById("settings-button");
const formElement = document.getElementById("settings-form");

// Cast to specific types if they exist
const settingsDialog = dialogElement instanceof HTMLDialogElement ? dialogElement : null;
const settingsButton = buttonElement instanceof HTMLButtonElement ? buttonElement : null;
const settingsForm = formElement instanceof HTMLFormElement ? formElement : null;

// Open dialog and update checkboxes
if (settingsButton && settingsDialog) {
  settingsButton.addEventListener("click", () => {
    // Update checkboxes to match the current model state
    const selectedNumbers = getSelectedNumbers();
    for (let i = 1; i <= 10; i += 1) {
        const checkboxElement = document.getElementById(`_${i}`);
        if (checkboxElement instanceof HTMLInputElement) {
            checkboxElement.checked = selectedNumbers.includes(i);
        }
    }
    // Make sure the dialog is shown with the showModal method
    if (!settingsDialog.open) {
      settingsDialog.showModal();
    }
  });
}

// Handle dialog submission (OK button)
if (settingsForm) {
  settingsForm.addEventListener("submit", () => {
      // Generate a new problem when settings are confirmed
      displayProblem();
  });
}

// Handle dialog cancellation (clicking outside)
if (settingsDialog) {
  // Handle click outside to close
  settingsDialog.addEventListener("click", (event) => {
    if (event.target === settingsDialog) {
        // Close the dialog but keep the current checkbox states
        settingsDialog.close();
    }
  });

  // Ensure escape key is also properly handled
  settingsDialog.addEventListener("cancel", (event) => {
    // Prevent default to ensure our custom closing logic runs
    event.preventDefault();
    settingsDialog.close();
  });
}

// Focus input when the dialog is closed (for both OK and cancel cases)
if (settingsDialog) {
  settingsDialog.addEventListener("close", () => {
    // Focus back on the answer input
    const answerInput = document.getElementById("answer");
    if (answerInput) {
      // Use setTimeout to ensure focus happens after any other operations
      setTimeout(() => {
        answerInput.focus();
      }, 0);
    }
  });
}

// Add event listeners to checkboxes for selecting numbers
for (let i = 1; i <= 10; i += 1) {
    const checkboxId = `_${i}`;
    const checkboxElement = document.getElementById(checkboxId);

    if (checkboxElement instanceof HTMLInputElement) {
      const checkbox = checkboxElement;

      // Initialize using the model's state
      const selectedNumbers = getSelectedNumbers();
      checkbox.checked = selectedNumbers.includes(i);

      checkbox.addEventListener("change", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
          // Update the model
          updateSelectedNumber(i, target.checked);
          console.log('Current state:', state);
        }
      });
    }
};