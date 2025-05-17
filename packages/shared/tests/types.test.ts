import { describe, it, expect } from 'vitest';
import { defaultAttributes } from '../src/types';

describe('types', () => {
  describe('defaultAttributes', () => {
    it('should have the correct default SVG attributes', () => {
      expect(defaultAttributes).toBeDefined();
      expect(defaultAttributes.xmlns).toBe('http://www.w3.org/2000/svg');
      expect(defaultAttributes.width).toBe(24);
      expect(defaultAttributes.height).toBe(24);
      expect(defaultAttributes.viewBox).toBe('0 0 24 24');
      expect(defaultAttributes.fill).toBe('none');
      expect(defaultAttributes.stroke).toBe('currentColor');
      expect(defaultAttributes.strokeWidth).toBe(2);
      expect(defaultAttributes.strokeLinecap).toBe('round');
      expect(defaultAttributes.strokeLinejoin).toBe('round');
    });
  });
});
