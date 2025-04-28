/** @type {import("eslint").Linter.Config} */
module.exports = {
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {
      console: 'readonly',
      process: 'readonly',
      module: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // ESLint base rules
    'no-console': ['error', {allow: ['warn', 'error', 'info']}],
    'no-debugger': 'warn',
    'no-unused-vars': 'off',
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'never'],
  },
  ignores: [
    'dist/**',
    'node_modules/**',
    'generated/**',
  ],
};
