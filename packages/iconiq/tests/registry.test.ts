import { describe, it, expect } from 'vitest';
import { IconRegistry } from '../src/registry';

describe('IconRegistry', () => {
  const mockIconData = {
    name: 'test-icon',
    tags: ['test', 'icon'],
    a11yLabel: 'Test Icon',
    categories: ['test'],
    variants: {
      outline: { path: 'M10 10h4v4h-4z' },
      filled: { path: 'M10 10h4v4h-4z' },
      sharp: { path: 'M10 10h4v4h-4z' },
    },
  };

  it('should create a new empty registry', () => {
    const registry = new IconRegistry();
    expect(registry).toBeDefined();
    expect(registry.getAllNames()).toEqual([]);
  });

  it('should register an icon and check its existence', () => {
    const registry = new IconRegistry();
    registry.register('test-icon', mockIconData);

    expect(registry.has('test-icon')).toBe(true);
    expect(registry.has('non-existent-icon')).toBe(false);
  });

  it('should retrieve a registered icon', () => {
    const registry = new IconRegistry();
    registry.register('test-icon', mockIconData);

    const icon = registry.get('test-icon');
    expect(icon).toEqual(mockIconData);
  });

  it('should throw an error when retrieving a non-existent icon', () => {
    const registry = new IconRegistry();

    expect(() => registry.get('non-existent-icon')).toThrow(
      "Icon 'non-existent-icon' not found in registry"
    );
  });

  it('should return all registered icon names', () => {
    const registry = new IconRegistry();
    registry.register('icon1', mockIconData);
    registry.register('icon2', { ...mockIconData, name: 'icon2' });
    registry.register('icon3', { ...mockIconData, name: 'icon3' });

    const names = registry.getAllNames();
    expect(names).toHaveLength(3);
    expect(names).toContain('icon1');
    expect(names).toContain('icon2');
    expect(names).toContain('icon3');
  });
});
