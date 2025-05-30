# End-to-End Testing with Playwright

This project includes end-to-end tests using Playwright to test the quiz application in real browsers.

## Setup

Playwright tests have been configured and are ready to use. All necessary dependencies are included in the `package.json` file.

## Running Tests

You can run the end-to-end tests using the following commands:

```bash
# Install dependencies
pnpm install

# Run all E2E tests
pnpm test:e2e

# Run tests with UI mode for debugging
pnpm test:e2e:ui

# Run tests in headed mode (visible browser)
pnpm test:e2e:headed
```

## Test Files

The Playwright tests are located in the `tests/e2e` directory:

- `quiz.spec.js` - Tests the quiz flow including answering correctly and incorrectly

## What's Being Tested

The E2E tests cover the following scenarios:

1. **Correct Answer Flow**:
   - Extracts the current math problem from the DOM
   - Calculates the correct answer
   - Submits the answer
   - Verifies the "👍" popover appears and then disappears
   - Verifies a new problem is generated

2. **Incorrect Answer Flow**:
   - Submits an incorrect answer
   - Verifies the "❌" popover appears and then disappears

3. **Focus Management**:
   - Verifies the answer input maintains focus throughout the quiz flow

## Configuration

The Playwright configuration is in `playwright.config.js`. It includes:

- Running tests against Chromium, Firefox, and WebKit
- Starting a local web server during test runs
- HTML report generation

You can modify the configuration to suit your specific needs.
