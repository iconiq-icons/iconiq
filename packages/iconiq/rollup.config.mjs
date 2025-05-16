import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

const external = ['@iconiq/shared'];
const inputs = {
  index: 'src/index.ts',
  icons: 'src/icons/index.ts',
};

export default defineConfig([
  // JS bundle configs
  {
    input: inputs,
    external,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].js',
        sourcemap: true,
        preserveModules: false,
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].mjs',
        sourcemap: true,
        preserveModules: false,
      },
    ],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      terser({
        format: {
          comments: false,
        },
      }),
    ],
  },
  // Type declaration config
  {
    input: inputs,
    external,
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
  },
]);
