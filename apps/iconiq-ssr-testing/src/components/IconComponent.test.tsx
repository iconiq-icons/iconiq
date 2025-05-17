import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { simulateHydration } from '../../tests/utils';
import IconComponent from './IconComponent';

describe('IconComponent', () => {
  it('renders with default props', () => {
    render(<IconComponent name="test-icon" />);
    const iconElement = screen.getByTestId('icon-component');

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveTextContent('test-icon');
    expect(iconElement).toHaveStyle({
      width: '24px',
      height: '24px',
    });
  });

  it('renders with custom props', () => {
    render(
      <IconComponent
        name="custom-icon"
        size={32}
        color="red"
        className="custom-class"
      />
    );

    const iconElement = screen.getByTestId('icon-component');

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveTextContent('custom-icon');
    expect(iconElement).toHaveStyle({
      width: '32px',
      height: '32px',
      color: 'red',
    });
    expect(iconElement).toHaveClass('custom-class');
  });

  it('hydrates correctly', () => {
    const { serverRender, clientRender } = simulateHydration(
      <IconComponent name="hydration-test" />
    );

    const serverIcon = serverRender.getByTestId('icon-component');
    const clientIcon = clientRender.getByTestId('icon-component');

    expect(serverIcon).toHaveTextContent('hydration-test');
    expect(clientIcon).toHaveTextContent('hydration-test');
  });
});
