import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIconData, getAllIconNames } from '../src';

vi.mock('../../../icons/arrow-right.json', () => ({
  name: 'arrow-right',
  tags: ['arrow', 'right', 'direction'],
  a11yLabel: 'Arrow Right',
  categories: ['navigation'],
  variants: {
    outline: { path: 'M14 5l7 7-7 7' },
    filled: { path: 'M14 5l7 7-7 7' },
    sharp: { path: 'M14 5l7 7-7 7' },
  },
  virtual: true,
}));

vi.mock('../../../icons/trash-2.json', () => ({
  name: 'trash-2',
  tags: ['delete', 'remove', 'bin'],
  a11yLabel: 'Trash',
  categories: ['action'],
  variants: {
    outline: {
      path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
    },
    filled: {
      path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
    },
    sharp: {
      path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6',
    },
  },
  virtual: true,
}));

describe('Icons Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIconData', () => {
    it('should load icon data for a valid icon name', async () => {
      const iconData = await getIconData('arrow-right');

      expect(iconData).toBeDefined();
      expect(iconData.name).toBe('arrow-right');
      expect(iconData.variants.outline).toBeDefined();
      expect(iconData.a11yLabel).toBe('Arrow Right');
    });

    it('should throw an error for an invalid icon name', async () => {
      await expect(getIconData('non-existent-icon')).rejects.toThrow(
        "Icon 'non-existent-icon' not found"
      );
    });
  });

  describe('getAllIconNames', () => {
    it('should return an array of all available icon names', async () => {
      const iconNames = await getAllIconNames();

      expect(Array.isArray(iconNames)).toBe(true);
      expect(iconNames).toContain('arrow-right');
      expect(iconNames).toContain('trash-2');
      expect(iconNames.length).toBe(2);
    });
  });
});
