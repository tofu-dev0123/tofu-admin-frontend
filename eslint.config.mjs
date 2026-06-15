import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      // ../ を禁止（alias はOK）
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*'],
        },
      ],

      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  prettierConfig,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
