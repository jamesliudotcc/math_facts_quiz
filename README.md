# Math facts quiz

This is a little plain HTML, CSS, and vanilla JS math facts quiz app. It keeps data on the client side and does not send any data to a server.

It targets modern browsers, so it takes advantage of newer CSS features like popover, and JS features like ES modules.

## GitHub Pages

To deploy this site to GitHub Pages:

1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Source", select "Deploy from a branch"
5. Select your main branch and the root folder
6. Click "Save"
# Math Facts Quiz

A simple math facts quiz application to help practice multiplication tables.

## Testing Strategy

This project uses Node.js's built-in test runner for fast, efficient testing.

### Test Types

1. **Unit Tests** - Test pure logic functions in isolation (fastest)
2. **DOM Structure Tests** - Verify HTML structure with JSDOM
3. **Math Logic Tests** - Test the core math functionality

### Running Tests

```bash
# Install dependencies first
npm install
# or if using pnpm
pnpm install

# Run all tests
npm test

# Run only unit tests (fastest)
npm run test:unit

# Run only DOM tests
npm run test:dom

# Run only integration tests
npm run test:integration
```

> Note: The Node.js test runner requires Node.js v18 or later with the `--test` flag support.

### Test Structure

- **math-utils.js** - Contains pure logic functions that can be tested without a DOM
- **index.js** - Contains DOM-specific code that interfaces with math-utils.js

This separation allows for fast unit testing of core logic while still allowing for thorough DOM testing when needed.

### Notes on Testing Approach

Our testing approach focuses on:

1. Testing pure logic functions in isolation (math operations, problem generation)
2. Verifying the HTML structure has all required elements
3. Testing the core functionality with focused tests rather than full end-to-end tests

This approach provides fast, reliable tests that are less prone to environmental issues while still ensuring the application works as expected.
Your site will be available at: `https://[your-username].github.io/[repository-name]/`

## Development

To run this project locally, simply clone the repository and open the `index.html` file in a modern browser.