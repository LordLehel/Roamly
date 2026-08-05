import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    rules: {
      // Mandatory type annotations for function parameters and arrow function parameters
      '@typescript-eslint/typedef': [
        'error',
        {
          parameter: true,
          arrowParameter: true,
        },
      ],

      // Mandatory return type annotations for functions and methods
      '@typescript-eslint/explicit-function-return-type': 'error',

      // Prohibit the use of the 'any' type
      '@typescript-eslint/no-explicit-any': 'error',

      // Enforce explicit return types on functions and class methods
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
]);
