import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IconsPage from './page';

// Mock the imported components
vi.mock('@/components/ServerIconComponent', () => ({
  default: async (props: any) => {
    // Create a mockup of a server component result
    const { default: IconComponent } = await import('@/components/IconComponent');
    return <IconComponent {...props} />;
  },
}));

vi.mock('@/components/ClientIconComponent', () => ({
  __esModule: true,
  default: ({ name, size, color }: any) => (
    <div data-testid="client-icon" data-name={name} data-size={size} data-color={color}>
      Mocked Client Icon
    </div>
  ),
}));

vi.mock('@/components/IconComponent', () => ({
  __esModule: true,
  default: ({ name, size, color }: any) => (
    <div data-testid="basic-icon" data-name={name} data-size={size} data-color={color}>
      Mocked Basic Icon
    </div>
  ),
}));

describe('IconsPage', () => {
  it('renders server, client, and basic components', async () => {
    // TypeScript workaround for async component
    const IconsPageComponent = (await IconsPage()) as JSX.Element;
    render(IconsPageComponent);

    // Check headings
    expect(screen.getByText('Icons Test Page')).toBeInTheDocument();
    expect(screen.getByText('Server Components')).toBeInTheDocument();
    expect(screen.getByText('Client Components')).toBeInTheDocument();
    expect(screen.getByText('Basic Components')).toBeInTheDocument();

    // Check client icons
    const clientIcons = screen.getAllByTestId('client-icon');
    expect(clientIcons.length).toBe(2);
    expect(clientIcons[0]).toHaveAttribute('data-name', 'client-icon-1');
    expect(clientIcons[1]).toHaveAttribute('data-name', 'client-icon-2');
    expect(clientIcons[1]).toHaveAttribute('data-size', '32');
    expect(clientIcons[1]).toHaveAttribute('data-color', 'red');

    // Check basic icons
    const basicIcons = screen.getAllByTestId('basic-icon');
    expect(basicIcons.length).toBe(4); // 2 from server components + 2 basic icons

    // Check the regular basic icons
    const basicIconNames = basicIcons.map(icon => icon.getAttribute('data-name'));
    expect(basicIconNames).toContain('basic-icon-1');
    expect(basicIconNames).toContain('basic-icon-2');

    // Check the server-rendered icons (which are now using basic icons internally)
    expect(basicIconNames).toContain('server-icon-1');
    expect(basicIconNames).toContain('server-icon-2');

    // Find the server icon 2 specifically
    const serverIcon2 = Array.from(basicIcons).find(
      icon => icon.getAttribute('data-name') === 'server-icon-2'
    );
    expect(serverIcon2).toHaveAttribute('data-color', 'blue');
    expect(serverIcon2).toHaveAttribute('data-size', '32');
  });
});
