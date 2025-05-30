# Testing Directory

This directory contains tests for the Math Facts Quiz application using Node.js's built-in test runner.

## Test Files

- **basic.test.js**: Simple test to verify the test runner is working
- **math-utils.test.js**: Tests for the core math utility functions
- **dom-utils.test.js**: Tests for DOM structure verification
- **math-logic.test.js**: Tests for the core math logic functionality
- **integration.test.js**: Simple integration tests for HTML structure
- **submit-functionality.test.js**: Tests for the form submission logic

## Running Tests

Tests can be run using the following NPM scripts:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only DOM tests
npm run test:dom

# Run only integration tests
npm run test:integration
```

## Testing Strategy

The testing strategy focuses on:

1. **Fast unit tests** for the core math logic
2. **DOM structure verification** to ensure required elements exist
3. **Focused functionality tests** rather than complex end-to-end tests

This approach provides a good balance between test speed and code coverage.
