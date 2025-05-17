import { describe, it, expect } from 'vitest';
import {
  toPascalCase,
  mergeClasses,
  convertPathToIconNode,
  getVariantNode,
  extractPathsFromSVG,
  sanitizeProps,
} from '../src/utils';
import { IconData } from '../src/types';

describe('toPascalCase', () => {
  it('should convert kebab-case to PascalCase', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
    expect(toPascalCase('icon-name')).toBe('IconName');
    expect(toPascalCase('multi-word-string')).toBe('MultiWordString');
    expect(toPascalCase('single')).toBe('Single');
  });
});

describe('mergeClasses', () => {
  it('should merge class names and filter out falsy values', () => {
    expect(mergeClasses('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    expect(mergeClasses('class1', undefined, 'class2')).toBe('class1 class2');
    expect(mergeClasses(undefined, undefined, 'class1')).toBe('class1');
    expect(mergeClasses()).toBe('');
  });
});

describe('convertPathToIconNode', () => {
  it('should convert a path string to an icon node structure', () => {
    const path = 'M10 10h4v4h-4z';
    const expected = [['path', { d: path }]];

    expect(convertPathToIconNode(path)).toEqual(expected);
  });
});

describe('getVariantNode', () => {
  const mockIconData: IconData = {
    name: 'test-icon',
    tags: ['test'],
    categories: ['test'],
    a11yLabel: 'Test Icon',
    variants: {
      outline: { path: 'M10 10h4v4h-4z' },
      filled: { path: 'M10 10h4v4h-4z' },
      sharp: { path: 'M10 10h4v4h-4z' },
    },
  };

  it('should get the icon node for a specified variant', () => {
    const result = getVariantNode(mockIconData, 'filled');
    const expected = [['path', { d: 'M10 10h4v4h-4z' }]];

    expect(result).toEqual(expected);
  });

  it('should fallback to outline variant when specified variant does not exist', () => {
    const result = getVariantNode(mockIconData, 'nonexistent' as any);
    const expected = [['path', { d: 'M10 10h4v4h-4z' }]];

    expect(result).toEqual(expected);
  });

  it('should throw error when no valid variant is found', () => {
    const invalidIconData = {
      ...mockIconData,
      variants: {}, // No variants available
    };

    expect(() => getVariantNode(invalidIconData)).toThrow(
      'No valid variant found for icon test-icon'
    );
  });
});

describe('extractPathsFromSVG', () => {
  it('should extract path data from SVG string', () => {
    const svgString = '<svg><path d="M10 10h4v4h-4z"/><path d="M5 5h2v2h-2z"/></svg>';
    const expected = ['M10 10h4v4h-4z', 'M5 5h2v2h-2z'];

    expect(extractPathsFromSVG(svgString)).toEqual(expected);
  });

  it('should return an empty array if no paths are found', () => {
    const svgString = '<svg><rect x="10" y="10" width="4" height="4"/></svg>';

    expect(extractPathsFromSVG(svgString)).toEqual([]);
  });
});

describe('sanitizeProps', () => {
  it('should remove size-related props', () => {
    const props = {
      size: '24',
      width: '32',
      height: '32',
      className: 'icon',
      style: { color: 'red' },
    };

    const result = sanitizeProps(props);

    expect(result).not.toHaveProperty('size');
    expect(result).not.toHaveProperty('width');
    expect(result).not.toHaveProperty('height');
    expect(result).toHaveProperty('className');
    expect(result).toHaveProperty('style');
  });

  it('should work with empty props', () => {
    const props = {};
    const result = sanitizeProps(props);

    expect(result).toEqual({});
  });
});
