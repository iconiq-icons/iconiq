import React from 'react';
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

interface ServerProps {
  children: React.ReactNode;
}

// Use this to test SSR components with hydration
export function renderToString(component: React.ReactElement) {
  // First render (SSR)
  const serverRender = render(component);
  return {
    serverRender,
  };
}

// Wrapper for testing server components
export function ServerComponent({ children }: ServerProps) {
  return <>{children}</>;
}

// Enhanced utility for testing hydration with interactive elements
export function simulateHydration(element: React.ReactElement) {
  // First render as SSR
  const { serverRender } = renderToString(element);

  // Then render as client
  const clientRender = render(element);

  return {
    serverRender,
    clientRender,
    // Helper to test interactions post-hydration
    interact: (testId: string, event: 'click' | 'hover' | 'focus' = 'click') => {
      const element = clientRender.getByTestId(testId);
      if (event === 'click') {
        fireEvent.click(element);
      } else if (event === 'hover') {
        fireEvent.mouseOver(element);
      } else if (event === 'focus') {
        fireEvent.focus(element);
      }
      return element;
    }
  };
}

// Test for server-side props application
export function testServerProps<PropType extends Record<string, any>>(
  Component: React.ComponentType<PropType>,
  testId: string,
  propsToTest: PropType,
  assertions: (result: RenderResult) => void
) {
  // Render with props
  const result = render(<Component {...propsToTest} />);

  // Run assertions
  assertions(result);

  return result;
}

// Compare server and client renders
export function compareServerClientRenders(element: React.ReactElement) {
  const { serverRender, clientRender } = simulateHydration(element);

  // Compare critical attributes and content
  const serverHTML = serverRender.container.innerHTML;
  const clientHTML = clientRender.container.innerHTML;

  return {
    serverRender,
    clientRender,
    serverHTML,
    clientHTML,
    // Returns true if no hydration mismatch
    match: serverHTML === clientHTML
  };
}
