import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { createIconiqIcon } from '../src/createIconiqIcon';
import React from 'react';

vi.mock('@iconiq/shared', () => {
  return {
    mergeClasses: (...classes: string[]) => classes.filter(Boolean).join(' '),
    convertPathToIconNode: (path: string) => [['path', { d: path }]],
    toPascalCase: (str: string) =>
      str
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(''),
  };
});

vi.mock('../src/Icon', () => {
  return {
    Icon: vi.fn().mockImplementation(({ iconNode, className, a11yLabel, ...props }) => {
      return (
        <svg className={className} aria-label={a11yLabel} {...props}>
          {iconNode.map((node: any, i: number) => {
            const [type, attrs] = node;
            return React.createElement(type, { key: i, ...attrs });
          })}
        </svg>
      );
    }),
  };
});

describe('createIconiqIcon', () => {
  // Mock icon data
  const mockIconData = {
    name: 'test-icon',
    tags: ['test'],
    a11yLabel: 'Test Icon',
    categories: ['test'],
    variants: {
      outline: { path: 'M10 10h4v4h-4z' },
      filled: { path: 'M5 5h2v2h-2z' },
      sharp: { path: 'M0 0h8v8h-8z' },
    },
  };

  it('should create a functional icon component', () => {
    const TestIcon = createIconiqIcon('test-icon', mockIconData);

    expect(TestIcon).toBeDefined();
    expect(typeof TestIcon).toBe('object'); // forwardRef returns an object
    expect(TestIcon.$$typeof).toBeDefined(); // React component

    // Test rendering the component
    const { container } = render(<TestIcon />);

    // Check SVG element
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    // Check that paths are rendered
    const path = container.querySelector('path');
    expect(path).not.toBeNull();
    expect(path?.getAttribute('d')).toBe('M10 10h4v4h-4z');
  });

  it('should generate displayName based on icon name', () => {
    const TestIcon = createIconiqIcon('test-icon-name', mockIconData);
    expect(TestIcon.displayName).toBe('TestIconNameIcon');
  });

  it('should use the specified variant', () => {
    const TestIcon = createIconiqIcon('test-icon', mockIconData);

    const { container } = render(<TestIcon variant="filled" />);
    const path = container.querySelector('path');
    expect(path?.getAttribute('d')).toBe('M5 5h2v2h-2z');
  });

  it('should accept custom className', () => {
    const TestIcon = createIconiqIcon('test-icon', mockIconData);

    const { container } = render(<TestIcon className="custom-class" />);
    const svg = container.querySelector('svg');

    // SVG className is actually an SVGAnimatedString, so we need to check differently
    expect(svg?.getAttribute('class')).toBe('iconiq-test-icon custom-class');
  });

  it('should set default variant as component default', () => {
    const TestIcon = createIconiqIcon('test-icon', mockIconData, 'sharp');

    const { container } = render(<TestIcon />);
    const path = container.querySelector('path');
    expect(path?.getAttribute('d')).toBe('M0 0h8v8h-8z');
  });

  it('should throw error when no valid variant is found', () => {
    // Create icon data with no variants
    const invalidIconData = {
      ...mockIconData,
      variants: {},
    };

    const TestIcon = createIconiqIcon('test-icon', invalidIconData);

    // Rendering should throw error
    expect(() => render(<TestIcon />)).toThrow('No valid variant found for icon test-icon');
  });
});
