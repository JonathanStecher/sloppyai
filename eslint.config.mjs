import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: Object.fromEntries([
        'process', 'Buffer', 'console', 'setTimeout', 'clearTimeout', 'URL',
        'AbortController', 'AbortSignal', 'structuredClone', '__CRAFTCHECK_BUNDLE__'
      ].map(name => [name, 'readonly']))
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-constant-condition': ['error', { checkLoops: false }]
    }
  }
];
