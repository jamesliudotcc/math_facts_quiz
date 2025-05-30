import { TIMES } from "./constants.js";
const history = [];
let currentProblem = {};
const selectedNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const generateProblem = () => {
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
}

const displayProblem = () => {
    currentProblem = generateProblem();
    document.getElementById("factor1").textContent = currentProblem.factor1;
    document.getElementById("operator").textContent = currentProblem.operator;
    document.getElementById("factor2").textContent = currentProblem.factor2;
}

// On page load, generate a problem and display it
window.addEventListener("load", () => {
    displayProblem();
    // set focus on the input
    document.getElementById("answer").focus();
})

const resultIsCorrect = (result) => {
    if (result.operator === TIMES) {
        return result.answer === result.factor1 * result.factor2;
    }
}

const popover = document.getElementById("correct_or_incorrect");

// Handle form submission
document.getElementById("quiz").addEventListener("submit", (event) => {
    event.preventDefault();
    const answerInput = document.getElementById("answer");
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

// Add this after the existing event listeners
document.getElementById("answer").addEventListener("blur", (event) => {
    // Wait 100ms before refocusing
    setTimeout(() => {
        event.target.focus();
    }, 100);
});

// Store original checkbox states for cancellation
let originalCheckboxStates = {};

// Get dialog and button elements
const settingsDialog = document.getElementById("settings-dialog");
const settingsButton = document.getElementById("settings-button");
const settingsForm = document.getElementById("settings-form");

// Open dialog and save original checkbox states
settingsButton.addEventListener("click", () => {
    // Update checkboxes to match the current selectedNumbers set
    for (let i = 1; i <= 10; i += 1) {
        const checkbox = document.getElementById(`_${i}`);
        checkbox.checked = selectedNumbers.has(i);
        // Save the current state for potential cancellation
        originalCheckboxStates[i] = checkbox.checked;
    }
    settingsDialog.showModal();
});

// Handle dialog submission (OK button)
settingsForm.addEventListener("submit", () => {

    // Generate a new problem when settings are confirmed
    displayProblem();
});

// Handle dialog cancellation (clicking outside)
settingsDialog.addEventListener("click", (event) => {
    if (event.target === settingsDialog) {
        // Restore original checkbox states
        for (let i = 1; i <= 10; i += 1) {
            document.getElementById(`_${i}`).checked = originalCheckboxStates[i];
        }
        settingsDialog.close();
    }
});

// Focus input when the dialog is closed (for both OK and cancel cases)
settingsDialog.addEventListener("close", () => {
    // Focus back on the answer input
    document.getElementById("answer").focus();
});

// Add event listeners to checkboxes for selecting numbers
for (let i = 1; i <= 10; i += 1) {
    const checkboxId = `_${i}`;
    document.getElementById(checkboxId).addEventListener("change", (event) => {
        if (event.target.checked) {
            selectedNumbers.add(i);
        } else {
            selectedNumbers.delete(i);
        }
        console.log("Selected numbers:", [...selectedNumbers]);
    });
};