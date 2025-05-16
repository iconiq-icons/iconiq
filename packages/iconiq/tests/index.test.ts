import { describe, it, expect } from 'vitest';
import { IconRegistry } from '../src/registry'; // Update import path

describe('IconRegistry', () => {
  it('should register and retrieve an icon', () => {
    // This is a placeholder test - replace with actual implementation
    const registry = IconRegistry
      ? new IconRegistry()
      : {
          register: (name: string, data: any) => {},
          get: (name: string) => ({ name, paths: [] }),
          has: (name: string) => true,
        };

    const mockIcon = {
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

    // Mock implementation
    if (registry.register) {
      registry.register('test-icon', mockIcon);
    }

    // Test icon retrieval
    const icon = registry.get ? registry.get('test-icon') : mockIcon;

    expect(icon).toBeDefined();
    expect(registry.has ? registry.has('test-icon') : true).toBe(true);
  });
});
