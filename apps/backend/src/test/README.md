# Backend API Tests

This directory contains unit tests for the backend API.

## Test Structure

The tests are organized by feature, with each feature having its own directory. Within each feature directory, there are test files for the controllers and routes.

```
test/
  features/
    todos/
      controllers.test.ts
      routes.test.ts
    // other features...
```

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

## Test Coverage

The tests aim to cover all the API endpoints and controller functions. The coverage report will show which parts of the code are covered by tests.

## Mocking

The tests use Vitest's mocking capabilities to mock the database and other dependencies. This allows the tests to run without a real database connection.

## Adding New Tests

When adding new features, make sure to add corresponding tests for the controllers and routes. Follow the existing test structure and patterns.
