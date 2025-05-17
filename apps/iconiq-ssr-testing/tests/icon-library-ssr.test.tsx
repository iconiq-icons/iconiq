import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { simulateHydration } from './utils';
import IconComponent from '../src/components/IconComponent';
import ClientIconComponent from '../src/components/ClientIconComponent';

// This would be replaced with actual imports from your icon library
// Simulating a few representative icons for testing
const mockIconTypes = [
  { name: 'alert', variant: 'filled', complexity: 'simple' },
  { name: 'user', variant: 'outlined', complexity: 'medium' },
  { name: 'chart', variant: 'two-tone', complexity: 'complex' },
  { name: 'logo', variant: 'brand', complexity: 'complex' },
];

describe('Icon Library SSR Testing', () => {
  // 1. Test basic rendering of different icon types
  describe('Icon Type Rendering', () => {
    it.each(mockIconTypes)('renders $name-$variant icon correctly in SSR',
      ({ name, variant }) => {
        const iconName = `${name}-${variant}`;
        const { serverRender, clientRender } = simulateHydration(
          <IconComponent name={iconName} />
        );

        // Both renders should contain the icon name
        const serverElement = serverRender.getByTestId('icon-component');
        const clientElement = clientRender.getByTestId('icon-component');

        expect(serverElement).toHaveTextContent(iconName);
        expect(clientElement).toHaveTextContent(iconName);
      }
    );
  });

  // 2. Test different icon styling variations
  describe('Icon Styling Variations', () => {
    // Testing different sizes
    it.each([16, 24, 32, 48])('renders icons at size %dpx correctly', (size) => {
      const { serverRender, clientRender } = simulateHydration(
        <IconComponent name="size-test" size={size} />
      );

      const serverElement = serverRender.getByTestId('icon-component');
      const clientElement = clientRender.getByTestId('icon-component');

      // Check size is applied consistently
      expect(serverElement).toHaveStyle({ width: `${size}px`, height: `${size}px` });
      expect(clientElement).toHaveStyle({ width: `${size}px`, height: `${size}px` });
    });

    // Testing different colors
    it.each(['red', '#00ff00', 'rgba(0, 0, 255, 0.5)', 'currentColor'])
      ('renders icons with color %s correctly', (color) => {
        render(<IconComponent name="color-test" color={color} />);
        const element = document.querySelector('[data-testid="icon-component"]');

        expect(element).toHaveStyle({ color });
      }
    );
  });

  // 3. Test client-side interactivity
  describe('Icon Interactivity', () => {
    it.each(mockIconTypes)('$name-$variant icon maintains interactivity after hydration',
      ({ name, variant }) => {
        const iconName = `${name}-${variant}`;
        const { clientRender, interact } = simulateHydration(
          <ClientIconComponent name={iconName} />
        );

        // Initial state
        expect(clientRender.queryByText('Clicked!')).not.toBeInTheDocument();

        // Interact with the component
        interact('client-icon-wrapper');

        // Post-interaction state
        expect(clientRender.getByText('Clicked!')).toBeInTheDocument();
      }
    );
  });

  // 4. Test complex combinations
  describe('Complex Rendering Scenarios', () => {
    it('handles multiple styled icons in a grid layout', () => {
      // This simulates a more realistic scenario with multiple icons in a layout
      const { clientRender } = simulateHydration(
        <div className="icon-grid">
          <IconComponent name="grid-icon-1" size={24} color="blue" />
          <IconComponent name="grid-icon-2" size={32} color="red" />
          <IconComponent name="grid-icon-3" size={16} color="green" />
          <IconComponent name="grid-icon-4" size={48} color="purple" />
        </div>
      );

      const icons = clientRender.getAllByTestId('icon-component');

      // Ensure all icons are rendered
      expect(icons.length).toBe(4);

      // Check first and last icon to ensure they maintained their props
      expect(icons[0]).toHaveTextContent('grid-icon-1');
      expect(icons[0]).toHaveStyle({ color: 'blue', width: '24px', height: '24px' });

      expect(icons[3]).toHaveTextContent('grid-icon-4');
      expect(icons[3]).toHaveStyle({ color: 'purple', width: '48px', height: '48px' });
    });
  });
});
