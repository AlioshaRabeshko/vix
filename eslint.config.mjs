import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
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
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  }, 
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/**',
    ],
  },
);
