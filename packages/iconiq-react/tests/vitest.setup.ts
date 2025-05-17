import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock the window.ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
