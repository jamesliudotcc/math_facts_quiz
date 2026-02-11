# Agent Development Guidelines

This document outlines the mandatory development practices and conventions for all AI agents working on the Math Facts Quiz project.

## Core Rules

1.  **Test-Driven Development (TDD):** Always write the tests *before* implementing the feature or fix.
2.  **Comprehensive Coverage:**
    *   **E2E Tests:** Ensure all UI interactions and user flows are covered by Playwright tests in the `tests/e2e/` directory.
    *   **Unit Tests:** Ensure all non-UI logic (math utilities, model state, SRS logic) is covered by unit tests in the `tests/` directory.
3.  **Technology Stack:**
    *   **Vanilla JS:** Always use standard Vanilla JavaScript (ES Modules). No external frameworks (React, Vue, etc.) should be introduced unless explicitly requested.
    *   **CSS:** Use standard CSS for styling.
4.  **Conventions:**
    *   Rigidly adhere to the existing project structure and naming conventions.
    *   Maintain the JSDoc type annotations found in `index.js`, `model.js`, and `math-utils.js`.
    *   Keep the logic modular and separated between `model.js` (state/logic) and `index.js` (DOM/events).
