import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IconComponent from '../src/components/IconComponent';
import ClientIconComponent from '../src/components/ClientIconComponent';
import { simulateHydration, compareServerClientRenders, testServerProps } from './utils';

// Sample icon variations to test
const iconVariations = [
  { name: 'simple-icon', size: 24, color: 'currentColor' },
  { name: 'large-icon', size: 48, color: 'blue' },
  { name: 'custom-icon', size: 32, color: 'red', className: 'custom-class' },
];

describe('Comprehensive SSR Testing', () => {
  beforeEach(() => {
    // Clear any mocks/spies between tests
    vi.clearAllMocks();
  });

  // 1. Test that the rendering mechanism works correctly
  describe('Rendering Mechanism', () => {
    it.each(iconVariations)('correctly renders icon: $name on server and client', iconProps => {
      const { match, serverHTML, clientHTML } = compareServerClientRenders(
        <IconComponent {...iconProps} />
      );

      // Basic content should be present in both renders
      expect(serverHTML).toContain(iconProps.name);
      expect(clientHTML).toContain(iconProps.name);

      // Ideally, they should match exactly for non-interactive components
      expect(match).toBe(true);
    });

    it('maintains correct DOM structure through SSR and hydration', () => {
      const { serverRender, clientRender } = simulateHydration(
        <IconComponent name="structure-test" />
      );

      // Both renders should have the same structure
      const serverElement = serverRender.getByTestId('icon-component');
      const clientElement = clientRender.getByTestId('icon-component');

      expect(serverElement.tagName).toBe('DIV');
      expect(clientElement.tagName).toBe('DIV');
      expect(serverElement.textContent).toBe('structure-test');
      expect(clientElement.textContent).toBe('structure-test');
    });
  });

  // 2. Test that props are properly applied
  describe('Props Application', () => {
    it.each(iconVariations)('applies style props correctly: $name', iconProps => {
      testServerProps(IconComponent, 'icon-component', iconProps, result => {
        const element = result.getByTestId('icon-component');

        // Check that size is applied correctly
        if (iconProps.size) {
          expect(element).toHaveStyle({
            width: `${iconProps.size}px`,
            height: `${iconProps.size}px`,
          });
        }

        // Check that color is applied correctly
        if (iconProps.color) {
          expect(element).toHaveStyle({ color: iconProps.color });
        }

        // Check that className is applied correctly
        if (iconProps.className) {
          expect(element).toHaveClass(iconProps.className);
        }
      });
    });

    it('applies all props simultaneously and correctly', () => {
      const complexProps = {
        name: 'complex-props-test',
        size: 64,
        color: 'purple',
        className: 'test-class special-icon',
      };

      render(<IconComponent {...complexProps} />);
      const element = screen.getByTestId('icon-component');

      expect(element).toHaveTextContent(complexProps.name);
      expect(element).toHaveStyle({
        width: `${complexProps.size}px`,
        height: `${complexProps.size}px`,
        color: complexProps.color,
      });
      expect(element).toHaveClass('test-class');
      expect(element).toHaveClass('special-icon');
    });
  });

  // 3. Test hydration specifically for interactive icons
  describe('Interactive Icon Hydration', () => {
    it('hydrates client component with click interaction', () => {
      const { clientRender, interact } = simulateHydration(
        <ClientIconComponent name="interactive-test" />
      );

      // Initial state - no "Clicked!" text
      expect(clientRender.queryByText('Clicked!')).not.toBeInTheDocument();

      // Interact with the component
      interact('client-icon-wrapper');

      // Post-interaction state - "Clicked!" text appears
      expect(clientRender.getByText('Clicked!')).toBeInTheDocument();
    });

    it('maintains state during client interactions', () => {
      // Render client component directly
      render(<ClientIconComponent name="stateful-test" />);

      // Initial state
      expect(screen.queryByText('Clicked!')).not.toBeInTheDocument();

      // First click
      fireEvent.click(screen.getByTestId('client-icon-wrapper'));
      expect(screen.getByText('Clicked!')).toBeInTheDocument();

      // Second click - state should toggle
      fireEvent.click(screen.getByTestId('client-icon-wrapper'));
      expect(screen.queryByText('Clicked!')).not.toBeInTheDocument();
    });

    it('handles custom props while remaining interactive', () => {
      // Test with custom props
      const { clientRender, interact } = simulateHydration(
        <ClientIconComponent
          name="custom-interactive"
          size={40}
          color="green"
          className="interactive-class"
        />
      );

      // Get the wrapper and icon
      const wrapper = clientRender.getByTestId('client-icon-wrapper');
      const icon = clientRender.getByTestId('icon-component');

      // Verify props passed through to inner component
      expect(icon).toHaveTextContent('custom-interactive');
      expect(icon).toHaveStyle({
        width: '40px',
        height: '40px',
        color: 'green',
      });
      expect(icon).toHaveClass('interactive-class');

      // Test interaction still works
      expect(wrapper).not.toHaveClass('clicked');
      interact('client-icon-wrapper');
      expect(wrapper).toHaveClass('clicked');
    });
  });
});
