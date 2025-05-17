import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'iconiq',
      include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
      // Extend any package-specific settings if needed
      coverage: {
        reportsDirectory: './coverage/iconiq',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'coverage/**',
          'dist/**',
          'node_modules/**',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.config.ts',
        ],
      },
    },
  })
);
