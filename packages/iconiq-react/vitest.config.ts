import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'iconiq-react',
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['./tests/vitest.setup.ts'],
      // Extend any package-specific settings if needed
      coverage: {
        reportsDirectory: './coverage/iconiq-react',
      },
    },
  })
);
