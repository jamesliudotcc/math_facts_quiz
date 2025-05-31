# End-to-End Tests for Math Facts Quiz

This directory contains end-to-end tests using Playwright to test the application in a real browser environment.

## Running the Tests

```bash
# Start the application server separately (recommended)
npm run start

# In another terminal:

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode (visual test runner)
npm run test:e2e:ui

# Run E2E tests with visible browser
npm run test:e2e:headed

# Run only basic functionality test (good for troubleshooting)
npm run test:e2e:basic

# Run only the simplest single test (best for troubleshooting)
npm run test:e2e:single

# Run only the click outside dialog test
npm run test:e2e:click

# Run only settings dialog tests
npm run test:e2e:settings
```

## Troubleshooting

If you encounter issues with the web server not starting properly, try these steps:

1. Start the web server separately with `npm run start`
2. Then run the tests in another terminal with `npm run test:e2e:basic`

This separates the server process from the test process and can help isolate issues.

## Test Structure

- **settings-dialog.spec.js**: Tests for the settings dialog functionality
  - Opening/closing the dialog
  - Selecting/deselecting numbers
  - Verifying the selected numbers are used in problems
  - Testing dialog cancellation (clicking outside)

## Common Challenges

1. **Timing issues**: E2E tests sometimes need small delays between actions
2. **Selector stability**: Use the most specific selectors possible
3. **Browser environment**: Tests run in a real browser, so DOM APIs work as expected
4. **Dialog behavior**: The settings dialog should maintain the checkbox states as they were at the time of closing, regardless of how the dialog is closed (OK button, Escape key, or clicking outside)

## Best Practices

1. Keep tests focused on user scenarios
2. Use descriptive test names
3. Make assertions specific
4. Handle asynchronous operations properly with `await`
5. Clean up after tests to ensure test isolation
