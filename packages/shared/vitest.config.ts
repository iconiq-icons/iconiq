import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'shared',
      include: ['tests/**/*.test.{ts,tsx}'],
      // Extend any package-specific settings if needed
      // For example, you might want to customize the coverage report directory
      coverage: {
        reportsDirectory: './coverage/shared',
      },
    },
  })
);
