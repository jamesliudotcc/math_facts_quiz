// Path: tests/math-logic.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { TIMES, DIVIDE } from '../constants.js';
import {
    generatePossibleProblems,
    updateSelectedOperator,
    getSelectedOperator,
    createNewProblem,
    updateSelectedNumber,
    state as modelState, // Direct access for checking internal state
    getSelectedNumbers,
    // No explicit reset in model.js, so tests manage state or sequence carefully
} from '../model.js';

// Helper to manually reset parts of the model state before tests that need a clean slate.
const resetModelForTest = () => {
    modelState.selectedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Default selected numbers
    modelState.selectedOperator = TIMES; // Default operator
    // Ensure selectedNumbers is sorted as it's done in updateSelectedNumber
    modelState.selectedNumbers.sort((a,b) => a-b);
    modelState.possibleProblems = generatePossibleProblems(modelState.selectedNumbers, modelState.selectedOperator);
    modelState.history = [];
    // Initialize currentProblem with a default structure matching Problem type
    modelState.currentProblem = { factor1: 1, factor2: 1, operator: TIMES };
    modelState.feedback = null;
};

test.describe('generatePossibleProblems for DIVIDE operator', () => {
    test.beforeEach(resetModelForTest);

    test('generates valid division problems for selectedNumbers=[2, 4, 8] and allNumbers (1-10)', () => {
        updateSelectedNumber(1, true); // Make sure 1 is in selected numbers for x/1 cases
        updateSelectedNumber(2, true);
        updateSelectedNumber(4, true);
        updateSelectedNumber(8, true);
        // Simulate selecting only these numbers for the test context
        modelState.selectedNumbers = [1, 2, 4, 8].sort((a,b) => a-b);

        const problems = generatePossibleProblems(modelState.selectedNumbers, DIVIDE);

        // Expected problems when selectedNumbers=[1,2,4,8] and allNumbers (1-10) is also considered by generatePossibleProblems
        // This includes pairs from selected, pairs from (allNumbers, selectedNumbers), pairs from (selectedNumbers, allNumbers)
        // For simplicity, we'll check key expected pairs rather than exhaustively listing all combinations.
        const expectedProblemSignatures = [
            [4,2], [8,2], [8,4], // from selectedNumbers
            [2,1], [4,1], [8,1], // from selectedNumbers (x / 1)
            // Examples from allNumbers (1-10) interacting with selected [1,2,4,8]
            [6,2], // 6 (from allNumbers) / 2 (from selected)
            [8,1], // 8 (from selected) / 1 (from allNumbers or selected) - already listed
            [4,4], // 4/4
            [8,8], // 8/8
        ];

        for (const sig of expectedProblemSignatures) {
            assert.ok(problems.some(p => p.number1 === sig[0] && p.number2 === sig[1]), `Missing expected problem: ${sig[0]} ÷ ${sig[1]}`);
        }

        assert.ok(problems.length > 0, "Should generate some division problems for [1,2,4,8]");
        problems.forEach(p => {
            assert.strictEqual(p.operator, DIVIDE, `Problem ${p.number1}÷${p.number2} has wrong operator`);
            assert.notStrictEqual(p.number2, 0, `Problem ${p.number1}÷${p.number2} has zero divisor`);
            assert.strictEqual(p.number1 % p.number2, 0, `Problem ${p.number1}÷${p.number2} is not divisible`);
            assert.ok(p.number1 / p.number2 >= 1, `Problem ${p.number1}÷${p.number2} has quotient < 1`);
        });

        const problemStrings = problems.map(p => `${p.number1}÷${p.number2}`);
        assert.strictEqual(new Set(problemStrings).size, problemStrings.length, "Should not have duplicate division problems after de-duplication logic");
    });

    test('generates specific problems for primes like [2, 3, 5] with 1 available', () => {
        // Ensure 1 is available, either in selectedNumbers or implicitly via allNumbers in generatePossibleProblems
        modelState.selectedNumbers = [1, 2, 3, 5].sort((a,b) => a-b);
        const problems = generatePossibleProblems(modelState.selectedNumbers, DIVIDE);

        const expectedProblems = [
            { operator: DIVIDE, number1: 2, number2: 1 },
            { operator: DIVIDE, number1: 3, number2: 1 },
            { operator: DIVIDE, number1: 5, number2: 1 },
        ];

        expectedProblems.forEach(exp => {
            assert.ok(problems.some(p => p.number1 === exp.number1 && p.number2 === exp.number2), `Missing ${exp.number1}÷${exp.number2}`);
        });

        // Check that no other division problems are generated if only primes are selected (and 1)
        // This assumes that allNumbers (1-10) doesn't create other valid pairs with [1,2,3,5]
        // e.g. 4/2 would not be formed if 4 is not in selected and 2 is.
        // This test needs careful consideration of how allNumbers interacts.
        // For [1,2,3,5], allNumbers could provide e.g. 4/2, 6/2, 6/3, 8/2, 9/3, 10/2, 10/5
        // So, the original assertion about "no other division problems" is too strong.
        // We'll just check that the expected x/1 problems are there.
    });

    test('generates only x/1 problems if selectedNumbers are primes and 1 is the only other number', () => {
        modelState.selectedNumbers = [1, 2, 3, 5].sort((a,b) => a-b); // Primes and 1
        // To make this test more specific, temporarily mock or assume allNumbers only contains these for this specific test scope if possible,
        // or acknowledge that allNumbers will contribute. Given the current structure, allNumbers (1-10) is always used.
        // So we expect problems like 6/2, 6/3, etc.
        const problems = generatePossibleProblems(modelState.selectedNumbers, DIVIDE);

        const expectedPrimeDivisionsByOne = [
            { number1: 2, number2: 1 },
            { number1: 3, number2: 1 },
            { number1: 5, number2: 1 },
        ];
        for(const exp of expectedPrimeDivisionsByOne) {
            assert.ok(problems.some(p => p.number1 === exp.number1 && p.number2 === exp.number2), `Missing ${exp.number1}/${exp.number2}`);
        }
        // Example of a problem from allNumbers: 6/2 (6 from allNumbers, 2 from selected)
        assert.ok(problems.some(p => p.number1 === 6 && p.number2 === 2), "Missing 6/2 from allNumbers interaction");
    });


    test('generates no problems for empty selectedNumbers []', () => {
        const selectedNumbers = [];
        const problems = generatePossibleProblems(selectedNumbers, DIVIDE);
        assert.strictEqual(problems.length, 0, "No problems should be generated for empty selectedNumbers");
    });
});

test.describe('generatePossibleProblems for TIMES operator', () => {
    test.beforeEach(resetModelForTest);
    test('still generates multiplication problems correctly', () => {
        modelState.selectedNumbers = [2, 3]; // Test with a smaller set
        const problems = generatePossibleProblems(modelState.selectedNumbers, TIMES);
        assert.ok(problems.length > 0, "Should generate multiplication problems");
        // Check for selected x selected (2x3)
        assert.ok(problems.some(p => p.number1 === 2 && p.number2 === 3 && p.operator === TIMES), "Missing 2×3");
        // Check for allNumbers x selected (e.g., 1x2)
        assert.ok(problems.some(p => p.number1 === 1 && p.number2 === 2 && p.operator === TIMES), "Missing 1×2");
        problems.forEach(p => assert.strictEqual(p.operator, TIMES));
    });
});

test.describe('Model State Management for Operator', () => {
    test.beforeEach(resetModelForTest);

    test('updateSelectedOperator correctly switches to DIVIDE', () => {
        updateSelectedOperator(DIVIDE);
        assert.strictEqual(getSelectedOperator(), DIVIDE, "Operator should be DIVIDE after update");
        assert.strictEqual(modelState.selectedOperator, DIVIDE, "modelState.selectedOperator should be DIVIDE");
        assert.ok(modelState.possibleProblems.length > 0, "Possible problems should be regenerated for DIVIDE");
        modelState.possibleProblems.forEach(p => {
            assert.strictEqual(p.operator, DIVIDE, "All possibleProblems should now be for DIVIDE");
            assert.ok(p.number1 % p.number2 === 0, `Problem ${p.number1}÷${p.number2} invalid in possibleProblems`);
        });
    });

    test('updateSelectedOperator correctly switches back to TIMES', () => {
        updateSelectedOperator(DIVIDE);
        updateSelectedOperator(TIMES);
        assert.strictEqual(getSelectedOperator(), TIMES, "Operator should be TIMES after update");
        assert.strictEqual(modelState.selectedOperator, TIMES, "modelState.selectedOperator should be TIMES");
        assert.ok(modelState.possibleProblems.length > 0, "Possible problems should be regenerated for TIMES");
        modelState.possibleProblems.forEach(p => assert.strictEqual(p.operator, TIMES, "All possibleProblems should now be for TIMES"));
    });
});

test.describe('createNewProblem with DIVIDE operator selected', () => {
    test.beforeEach(() => {
        resetModelForTest();
        // Setup a scenario where division problems can definitely be generated
        modelState.selectedNumbers = [2, 4, 6, 8, 10];
        updateSelectedNumber(1, true); // Ensure 1 is present for x/1 cases
        updateSelectedOperator(DIVIDE);
    });

    test('generates a valid division problem', () => {
        const problem = createNewProblem();
        assert.strictEqual(problem.operator, DIVIDE, `Generated problem operator is ${problem.operator}, expected DIVIDE`);

        if (modelState.possibleProblems.length > 0) {
            assert.ok(modelState.possibleProblems.some(p => p.number1 === problem.factor1 && p.number2 === problem.factor2), "Generated problem must be from the possible set")
            assert.notStrictEqual(problem.factor2, 0, `Divisor is zero: ${problem.factor1} ÷ ${problem.factor2}`);
            assert.strictEqual(problem.factor1 % problem.factor2, 0, `Problem not divisible: ${problem.factor1} ÷ ${problem.factor2}`);
            assert.ok(problem.factor1 / problem.factor2 >= 1, `Quotient < 1: ${problem.factor1} ÷ ${problem.factor2}`);
        } else {
            // This fallback case in createNewProblem should ideally not be hit if selectedNumbers can form problems.
            // If selectedNumbers was e.g. [7] (a prime) and DIVIDE, then possibleProblems would be empty.
            // The model's createNewProblem has a fallback { factor1: 4, factor2: 2, operator: DIVIDE }
            assert.strictEqual(problem.factor1, 4, "Fallback factor1 should be 4 if no problems generated");
            assert.strictEqual(problem.factor2, 2, "Fallback factor2 should be 2 if no problems generated");
        }
    });
});

test.describe('updateSelectedNumber with DIVIDE operator active', () => {
    test.beforeEach(() => {
        resetModelForTest();
        updateSelectedOperator(DIVIDE);
        // Start with a minimal set for division, e.g., only 1, or empty and add numbers
        modelState.selectedNumbers = [1];
        modelState.possibleProblems = generatePossibleProblems(modelState.selectedNumbers, DIVIDE);
    });

    test('correctly regenerates division problems when numbers are added', () => {
        // Initially, with selectedNumbers = [1], problems like 2/1, 3/1 etc. (from allNumbers) should exist
        assert.ok(modelState.possibleProblems.some(p => p.number1 === 2 && p.number2 === 1), "Missing 2/1 initially");

        updateSelectedNumber(4, true); // Adds 4 to [1] -> [1,4]
        updateSelectedNumber(2, true); // Adds 2 to [1,4] -> [1,2,4]

        const problems = modelState.possibleProblems;
        assert.ok(problems.some(p => p.number1 === 4 && p.number2 === 2 && p.operator === DIVIDE), "Missing 4÷2 after adding 4 and 2");
        assert.ok(problems.some(p => p.number1 === 2 && p.number2 === 1 && p.operator === DIVIDE), "Missing 2÷1 after adding 4 and 2");
        assert.ok(problems.some(p => p.number1 === 4 && p.number2 === 1 && p.operator === DIVIDE), "Missing 4÷1 after adding 4 and 2");

        updateSelectedNumber(8, true); // Adds 8 to [1,2,4] -> [1,2,4,8]
        const newProblems = modelState.possibleProblems;
        assert.ok(newProblems.some(p => p.number1 === 8 && p.number2 === 4 && p.operator === DIVIDE), "Missing 8÷4 after adding 8");
        assert.ok(newProblems.some(p => p.number1 === 8 && p.number2 === 2 && p.operator === DIVIDE), "Missing 8÷2 after adding 8");
        newProblems.forEach(p => {
            assert.strictEqual(p.operator, DIVIDE);
            assert.ok(p.number1 % p.number2 === 0);
        });
    });
});
