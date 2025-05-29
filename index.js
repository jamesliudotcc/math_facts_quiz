import { TIMES } from "./constants.js";
const history = [];
let currentProblem = {};

const generateProblem = () => ({
    factor1: Math.floor(Math.random() * 10) + 1,
    factor2: Math.floor(Math.random() * 10) + 1,
    operator: TIMES,
})

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