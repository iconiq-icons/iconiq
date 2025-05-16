import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'iconiq',
      include: ['tests/**/*.test.{ts,tsx}'],
      // Extend any package-specific settings if needed
      coverage: {
        reportsDirectory: './coverage/iconiq',
      },
    },
  })
);
