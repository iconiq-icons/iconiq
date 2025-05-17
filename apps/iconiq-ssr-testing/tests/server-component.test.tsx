import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServerComponent } from './utils';
import IconComponent from '../src/components/IconComponent';

// Mock the ServerIconComponent
vi.mock('../src/components/ServerIconComponent', () => ({
  ServerIconComponent: async (props: any) => {
    // Simulate async server component
    return <IconComponent {...props} />;
  }
}));

describe('Server Component SSR Tests', () => {
  // Test static rendering of server components
  describe('Static Rendering', () => {
    it('renders server components statically', async () => {
      // Import needs to be dynamic because it's an async component
      const { ServerIconComponent } = await import('../src/components/ServerIconComponent');

      // Use the async component
      const ServerIconElement = await ServerIconComponent({
        name: 'server-rendered-icon',
        size: 32,
        color: 'blue'
      });

      // Render the result inside our server component wrapper
      render(<ServerComponent>{ServerIconElement}</ServerComponent>);

      // Verify it rendered correctly
      const iconElement = screen.getByTestId('icon-component');
      expect(iconElement).toHaveTextContent('server-rendered-icon');
      expect(iconElement).toHaveStyle({
        width: '32px',
        height: '32px',
        color: 'blue'
      });
    });
  });

  // Test a page with mixed server and client components
  describe('Mixed Component Rendering', () => {
    it('renders a mix of server and client components', async () => {
      // Import needs to be dynamic because it's an async component
      const { ServerIconComponent } = await import('../src/components/ServerIconComponent');
      const ClientIconComponent = (await import('../src/components/ClientIconComponent')).default;

      // Create server component
      const ServerIconElement = await ServerIconComponent({
        name: 'mixed-server-icon',
        size: 24,
      });

      // Render a mix of server and client components
      render(
        <div className="mixed-container">
          <ServerComponent>{ServerIconElement}</ServerComponent>
          <ClientIconComponent name="mixed-client-icon" size={32} color="red" />
        </div>
      );

      // Get all icon components
      const iconElements = screen.getAllByTestId('icon-component');

      // Verify we have both components
      expect(iconElements.length).toBe(2);

      // Verify server component
      expect(iconElements[0]).toHaveTextContent('mixed-server-icon');
      expect(iconElements[0]).toHaveStyle({
        width: '24px',
        height: '24px',
      });

      // Verify client component
      expect(iconElements[1]).toHaveTextContent('mixed-client-icon');
      expect(iconElements[1]).toHaveStyle({
        width: '32px',
        height: '32px',
        color: 'red'
      });
    });
  });

  // Test varying props
  describe('Server Component Props', () => {
    it.each([
      { name: 'test-icon-1', size: 16, color: 'green' },
      { name: 'test-icon-2', size: 24, color: 'blue' },
      { name: 'test-icon-3', size: 48, color: 'red' },
    ])('renders server icon with props %s', async (props) => {
      // Import needs to be dynamic because it's an async component
      const { ServerIconComponent } = await import('../src/components/ServerIconComponent');

      // Create server component with props
      const ServerIconElement = await ServerIconComponent(props);

      // Render it
      render(<ServerComponent>{ServerIconElement}</ServerComponent>);

      // Verify props were applied
      const iconElement = screen.getByTestId('icon-component');
      expect(iconElement).toHaveTextContent(props.name);
      expect(iconElement).toHaveStyle({
        width: `${props.size}px`,
        height: `${props.size}px`,
        color: props.color
      });
    });
  });
});
