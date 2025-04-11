import { describe, it, expect } from 'vitest';

describe('Basic Test Environment', () => {
  it('should work with basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
  });

  it('should run async tests', async () => {
    const result = await Promise.resolve('async value');
    expect(result).toBe('async value');
  });
}); 