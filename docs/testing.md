# Testing

This document covers the testing strategies, tools, and guidelines for the Arbor Desktop application.

## Overview

The application uses Vitest for unit and integration testing, along with Testing Library for React component testing.

## Test Structure

Tests are colocated with the code they test:
- Unit tests: `*.test.ts`
- React component tests: `*.test.tsx`
- Integration tests: `*.test.ts` or `*.integration.test.ts`

## Running Tests

### All Tests

To run all tests:

```bash
pnpm test
```

### Test UI

To run tests with the Vitest UI:

```bash
pnpm test:ui
```

### Watch Mode

To run tests in watch mode:

```bash
pnpm test:watch
```

## Writing Tests

### Unit Tests

Unit tests should focus on testing individual functions and classes in isolation.

Example:
```ts
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### Component Tests

Component tests should use Testing Library to test user interactions and component behavior.

Example:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Tests

Integration tests should test the interaction between multiple units or components.

Example:
```ts
import { describe, it, expect } from 'vitest';
import { createStore } from 'zustand';
import { createCounterStore } from './counterStore';

describe('Counter Store', () => {
  it('should increment the count', () => {
    const useStore = createCounterStore();
    const store = createStore(useStore);
    
    expect(store.getState().count).toBe(0);
    store.getState().increment();
    expect(store.getState().count).toBe(1);
  });
});
```

## Mocking

### Mocking Dependencies

Use Vitest's built-in mocking capabilities to mock dependencies:

```ts
import { vi, describe, it, expect } from 'vitest';

// Mock a module
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'John' })
}));

// Mock a global object
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Mocking tRPC Calls

When testing components that use tRPC, mock the tRPC hooks:

```ts
import { vi, describe, it } from 'vitest';
import * as trpc from '@trpc/react-query';

vi.mock('@trpc/react-query', () => ({
  createTRPCReact: () => ({
    useQuery: vi.fn().mockReturnValue({ data: null, isLoading: false }),
    useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  }),
}));
```

## Test Coverage

To check test coverage:

```bash
pnpm test:coverage
```

Aim for at least 80% coverage for critical functionality.

## Best Practices

1. **Test behavior, not implementation**: Focus on what the code does rather than how it does it
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Keep tests focused**: Each test should verify one behavior
4. **Use beforeEach/afterEach**: Set up and tear down test state as needed
5. **Mock external dependencies**: Isolate the code under test
6. **Test edge cases**: Include tests for error conditions and boundary values
7. **Avoid testing implementation details**: Don't test internal state unless necessary
8. **Use data-driven tests**: Use `it.each` for testing multiple similar cases

## Continuous Integration

Tests are automatically run in the CI pipeline on every pull request. All tests must pass before merging.

## Debugging Tests

To debug tests:

1. Add `debugger` statements in your test code
2. Run tests in watch mode with `pnpm test:watch`
3. Use the Vitest UI with `pnpm test:ui` for interactive debugging
4. Use `console.log` statements for debugging (remove them before committing)

## Performance

To ensure tests run quickly:

1. Mock expensive operations
2. Use `vi.useFakeTimers()` for time-based tests
3. Avoid unnecessary setup in beforeEach
4. Use `vi.mock` to mock modules that aren't being tested