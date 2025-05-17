import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DynamicIcon } from '../src/DynamicIcon';
import React from 'react';

// Mock the iconiq/core dependency
vi.mock('@iconiq/core', () => ({
  getIconData: vi.fn().mockImplementation(name => {
    if (name === 'error-icon') {
      return Promise.reject(new Error('Failed to load icon'));
    }

    if (name === 'outline-only-icon') {
      return Promise.resolve({
        name,
        a11yLabel: `${name} icon`,
        variants: {
          outline: { path: 'M10 10h4v4h-4z' },
          // No filled or sharp variants
        },
      });
    }

    return Promise.resolve({
      name,
      a11yLabel: `${name} icon`,
      variants: {
        outline: { path: 'M10 10h4v4h-4z' },
        filled: { path: 'M5 5h2v2h-2z' },
        sharp: { path: 'M0 0h8v8h-8z' },
      },
    });
  }),
}));

// Create a mock fallback component
const FallbackComponent = () => <div data-testid="fallback">Loading...</div>;

describe('DynamicIcon Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the icon after loading', async () => {
    const { container } = render(<DynamicIcon name="test-icon" />);

    // Initially, there should be no SVG
    expect(container.querySelector('svg')).toBeNull();

    // After loading, SVG should be rendered
    await waitFor(() => {
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });

  it('should render with the specified variant', async () => {
    const { container } = render(<DynamicIcon name="test-icon" variant="filled" />);

    await waitFor(() => {
      const pathElement = container.querySelector('path');
      expect(pathElement).not.toBeNull();
      expect(pathElement?.getAttribute('d')).toBe('M5 5h2v2h-2z');
    });
  });

  it('should fallback to outline variant if specified variant is invalid', async () => {
    // @ts-expect-error Testing invalid variant behavior
    const { container } = render(<DynamicIcon name="test-icon" variant="invalid-variant" />);

    await waitFor(() => {
      const pathElement = container.querySelector('path');
      expect(pathElement).not.toBeNull();
      expect(pathElement?.getAttribute('d')).toBe('M10 10h4v4h-4z');
    });
  });

  it('should render the fallback component while loading', () => {
    render(<DynamicIcon name="test-icon" fallback={FallbackComponent} />);

    // Fallback should be rendered initially
    const fallbackElement = screen.getByTestId('fallback');
    expect(fallbackElement).not.toBeNull();
    expect(fallbackElement.textContent).toBe('Loading...');
  });

  it('should handle error when loading icon fails', async () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(<DynamicIcon name="error-icon" fallback={FallbackComponent} />);

    // Fallback should remain rendered after error
    await waitFor(() => {
      const fallbackElement = screen.getByTestId('fallback');
      expect(fallbackElement).not.toBeNull();
      expect(fallbackElement.textContent).toBe('Loading...');
      expect(container.querySelector('svg')).toBeNull();
    });

    // Check if error was logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should apply custom props to the SVG element', async () => {
    const { container } = render(
      <DynamicIcon name="test-icon" className="custom-class" size={24} data-testid="custom-icon" />
    );

    await waitFor(() => {
      const svgElement = container.querySelector('svg');
      expect(svgElement).not.toBeNull();
      expect(svgElement?.classList.contains('custom-class')).toBe(true);
      expect(svgElement?.getAttribute('width')).toBe('24');
      expect(svgElement?.getAttribute('height')).toBe('24');
      expect(svgElement?.getAttribute('data-testid')).toBe('custom-icon');
    });
  });

  it('should handle icon with only outline variant', async () => {
    const { container } = render(<DynamicIcon name="outline-only-icon" variant="filled" />);

    await waitFor(() => {
      const pathElement = container.querySelector('path');
      expect(pathElement).not.toBeNull();
      expect(pathElement?.getAttribute('d')).toBe('M10 10h4v4h-4z');
    });
  });
});
