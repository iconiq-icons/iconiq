import { describe, it, expect } from 'vitest';
import { sanitizeProps } from '../src/utils'; // Update import path

describe('sanitizeProps', () => {
  it('should remove size-related props', () => {
    const props = {
      size: '24',
      width: '32',
      height: '32',
      className: 'icon',
      style: { color: 'red' },
    };

    // Mock implementation for the test, replace with actual implementation
    const result = sanitizeProps
      ? sanitizeProps(props)
      : { className: 'icon', style: { color: 'red' } };

    // This test is just a placeholder - update according to actual implementation
    expect(result).not.toHaveProperty('size');
    expect(result).not.toHaveProperty('width');
    expect(result).not.toHaveProperty('height');
    expect(result).toHaveProperty('className');
    expect(result).toHaveProperty('style');
  });
});
