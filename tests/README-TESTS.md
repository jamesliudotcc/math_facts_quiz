# Math Facts Quiz Tests

## Test Structure

This project uses Node.js's built-in test runner (flag: `--test`) rather than a third-party framework like Jest.

### Files

- **basic.test.js**: Simple test to verify the test runner works
- **math-utils.test.js**: Core tests for math utility functions
- **math-logic.test.js**: Additional math logic tests
- **dom-utils.test.js**: Tests for DOM element structure
- **integration.test.js**: Tests for HTML structure elements
- **submit-functionality.test.js**: Tests for the submit logic

### Utils

- **utils.js**: Shared test utilities like setupDOM()

## Running Tests

```bash
# All tests
npm test

# Specific categories
npm run test:unit
npm run test:dom
npm run test:integration
```

## Common Issues

- **JSDOM limitations**: The JSDOM library may not perfectly replicate browser behavior
- **Global variable issues**: Be careful when using global variables in tests
- **ESM Import/Export**: All test files use ES modules (type="module" in package.json)

## Best Practices

1. Keep tests fast and focused
2. Use utils.js for shared functionality
3. For DOM tests, verify structure without attempting to fully execute app code
4. Use integration tests sparingly, as they are more brittle
5. Mock dependencies where appropriate

## Future Improvements

- Add code coverage reporting
- Consider adding visual regression tests
- Implement more detailed integration tests if needed
