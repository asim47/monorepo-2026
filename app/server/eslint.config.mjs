// Extends root ESLint config with server-specific overrides
import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    // Allow CommonJS for .js config files
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
