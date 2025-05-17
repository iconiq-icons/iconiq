import React from 'react';
import '@testing-library/jest-dom/vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => ({ get: vi.fn() })),
}));

// Mock next/image for SSR testing
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, ...props }) => {
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      ...props,
    });
  },
}));
