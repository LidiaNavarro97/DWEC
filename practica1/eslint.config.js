import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'no-var': 'error',
      eqeqeq: 'error',
      'no-console': 'error',
    },
  },
];
