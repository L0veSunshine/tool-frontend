import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tsEslint from 'typescript-eslint';
import { fixupPluginRules } from '@eslint/compat';

export default tsEslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
    },
    plugins: {
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single'],
    },
  },
);
