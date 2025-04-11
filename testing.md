# Testing Guide

This project uses Vitest as its testing framework, which is optimized for Vite-based projects.

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in `__tests__` directories next to the code they test:

- `src/components/__tests__/` - Component tests
- `src/hooks/__tests__/` - Hook tests
- `src/utils/__tests__/` - Utility function tests
- `src/pages/__tests__/` - Page component tests

## Writing Tests

### Components

For testing React components, we use React Testing Library:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Hooks

For testing hooks, we use the renderHook utility:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useYourHook } from '../useYourHook';

describe('useYourHook', () => {
  it('returns expected value', async () => {
    const { result } = renderHook(() => useYourHook());
    await waitFor(() => {
      expect(result.current).toBe(expectedValue);
    });
  });
});
```

### Utility Functions

For testing utility functions, use straightforward unit tests:

```typescript
import { describe, it, expect } from 'vitest';
import { yourUtilityFunction } from '../yourUtilityFile';

describe('Your Utility Function', () => {
  it('produces the expected output for valid input', () => {
    const result = yourUtilityFunction('input');
    expect(result).toBe('expected output');
  });

  it('handles edge cases appropriately', () => {
    expect(yourUtilityFunction('')).toBe('default value');
    expect(yourUtilityFunction(null)).toBe('default value');
  });
});
```

#### Testing Venue Utilities

The venue utilities have comprehensive tests that verify proper address formatting across multiple scenarios:

```typescript
import { describe, it, expect } from 'vitest';
import { formatVenueAddress, isEventOnline } from '../venueUtils';

describe('formatVenueAddress', () => {
  it('should format address when address_1 is the same as city, state', () => {
    const venue = {
      name: 'Mill Mountain Coffee',
      address_1: 'Roanoke, VA',
      city: 'Roanoke',
      state: 'VA',
      country: 'us',
      zip: '24016'
    };
    expect(formatVenueAddress(venue, false)).toBe('Roanoke, VA 24016');
  });

  it('should handle empty address_1 gracefully', () => {
    const venue = {
      name: 'Mill Mountain Coffee',
      address_1: '',
      city: 'Roanoke',
      state: 'VA',
      country: 'us',
      zip: '24016'
    };
    expect(formatVenueAddress(venue, false)).toBe('Roanoke, VA 24016');
  });
});
```

### Mocking

To mock dependencies, use Vitest's mocking capabilities:

```tsx
import { vi } from 'vitest';

// Mock a dependency
vi.mock('../yourModule', () => ({
  default: vi.fn().mockReturnValue('mocked value')
}));

// Mock a function
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked result');
```

## Date and Timezone Considerations

When testing date-related functionality, be aware of timezone issues. Instead of relying on ISO strings (which include timezone information), test individual date components:

```typescript
// Instead of this (prone to timezone issues):
expect(date.toISOString()).toContain('2025-04-26T10:00:00');

// Use this (more resilient to timezone differences):
expect(date.getFullYear()).toBe(2025);
expect(date.getMonth()).toBe(3); // 0-indexed, so April is 3
expect(date.getDate()).toBe(26);
expect(date.getHours()).toBe(10);
expect(date.getMinutes()).toBe(0);
```

## Configuration

The test configuration is in `vitest.config.ts` in the project root. 