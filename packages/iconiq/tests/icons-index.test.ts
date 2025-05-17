import { describe, it, expect } from 'vitest';
import { Icons } from '../src/icons';

describe('Icons Index', () => {
  it('should export the Icons object', () => {
    expect(Icons).toBeDefined();
    expect(typeof Icons).toBe('object');
  });
});
