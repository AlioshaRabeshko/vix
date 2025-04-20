/** @type {import("eslint").Linter.Config} */
module.exports = {
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // project: "./tsconfig.json", // якщо використовуєш type-aware linting
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
    'no-unused-vars': 'off', // перекривається TypeScript-версією
    quotes: ['error', 'single'],             // Одинарні лапки
    'object-curly-spacing': ['error', 'never'], // Без пробілів між { і }
  },
  ignores: [
    'dist/**',
    'node_modules/**',
    'generated/**',
  ],
};
