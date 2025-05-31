// We're importing TIMES but using it indirectly through generateProblem
// @ts-ignore: Used indirectly
import { TIMES } from "./constants.js";
import { generateProblem, resultIsCorrect } from "./math-utils.js";

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
 * @property {number} time - Timestamp when the answer was submitted
 */

/** @type {Result[]} */
const history = [];
/** @type {Problem} */
let currentProblem = {
  factor1: 0,
  factor2: 0,
  operator: "×"
};
/** @type {Set<number>} */
const selectedNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

/**
 * Displays a new math problem on the page
 * @returns {void}
 */
const displayProblem = () => {
    currentProblem = generateProblem(selectedNumbers);
    const factor1Element = document.getElementById("factor1");
    const operatorElement = document.getElementById("operator");
    const factor2Element = document.getElementById("factor2");

    if (factor1Element) factor1Element.textContent = String(currentProblem.factor1);
    if (operatorElement) operatorElement.textContent = currentProblem.operator;
    if (factor2Element) factor2Element.textContent = String(currentProblem.factor2);
}

// On page load, generate a problem and display it
window.addEventListener("load", () => {
    displayProblem();
    // set focus on the input
    const answerInput = document.getElementById("answer");
    if (answerInput) answerInput.focus();
})

/** @type {HTMLElement | null} */
const popover = document.getElementById("correct_or_incorrect");

// Handle form submission
const quizForm = document.getElementById("quiz");
if (quizForm) {
  quizForm.addEventListener("submit", (/** @type {SubmitEvent} */ event) => {
    event.preventDefault();
    const answerElement = document.getElementById("answer");
    if (!(answerElement instanceof HTMLInputElement)) {
      return; // Exit if not found or wrong type
    }
    const answerInput = answerElement;
    const value = parseInt(answerInput.value);
    const result = {
        factor1: currentProblem.factor1,
        factor2: currentProblem.factor2,
        operator: currentProblem.operator,
        answer: value,
        time: Date.now(),
    };
    if (resultIsCorrect(result)) {
        popover.textContent = "👍";
    } else {
        popover.textContent = "❌";
    }
    // Toggle the show class to display the popover
    popover.classList.toggle("show");
    setTimeout(() => {
        popover.classList.toggle("show");
    }, 1000);
    history.push(result);
    console.log({history});
    answerInput.value = "";
    displayProblem();
    answerInput.focus();
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

// Store original checkbox states for cancellation
/** @type {Record<number, boolean>} */
let originalCheckboxStates = {};

// Get dialog and button elements
const dialogElement = document.getElementById("settings-dialog");
const buttonElement = document.getElementById("settings-button");
const formElement = document.getElementById("settings-form");

// Cast to specific types if they exist
const settingsDialog = dialogElement instanceof HTMLDialogElement ? dialogElement : null;
const settingsButton = buttonElement instanceof HTMLButtonElement ? buttonElement : null;
const settingsForm = formElement instanceof HTMLFormElement ? formElement : null;

// Open dialog and save original checkbox states
if (settingsButton && settingsDialog) {
  settingsButton.addEventListener("click", () => {
    // Update checkboxes to match the current selectedNumbers set
    for (let i = 1; i <= 10; i += 1) {
        const checkboxElement = document.getElementById(`_${i}`);
        if (checkboxElement instanceof HTMLInputElement) {
            const checkbox = checkboxElement;
            checkbox.checked = selectedNumbers.has(i);
            // Save the current state for potential cancellation
            originalCheckboxStates[i] = checkbox.checked;
        }
    }
    settingsDialog.showModal();
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
  settingsDialog.addEventListener("click", (event) => {
    if (event.target === settingsDialog) {
        // Close the dialog but keep the current checkbox states
        settingsDialog.close();
    }
  });
}

// Focus input when the dialog is closed (for both OK and cancel cases)
if (settingsDialog) {
  settingsDialog.addEventListener("close", () => {
    // Focus back on the answer input
    const answerInput = document.getElementById("answer");
    if (answerInput) {
      answerInput.focus();
    }
  });
}

// Add event listeners to checkboxes for selecting numbers
for (let i = 1; i <= 10; i += 1) {
    const checkboxId = `_${i}`;
    const checkboxElement = document.getElementById(checkboxId);

    if (checkboxElement instanceof HTMLInputElement) {
      const checkbox = checkboxElement;
      // Initialize selectedNumbers with checked state
      if (checkbox.checked) {
        selectedNumbers.add(i);
      } else {
        selectedNumbers.delete(i);
      }

      checkbox.addEventListener("change", (/** @type {Event} */ event) => {
        /** @type {HTMLInputElement} */
        const target = /** @type {HTMLInputElement} */ (event.target);
        if (target.checked) {
            selectedNumbers.add(i);
        } else {
            selectedNumbers.delete(i);
        }
        console.log("Selected numbers:", [...selectedNumbers]);
      });
    }
};