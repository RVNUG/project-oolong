// ESLint v9 configuration
import js from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginReact from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a compat instance
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  // Use js recommended rules as base
  js.configs.recommended,
  
  // Specify globals
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
    }
  },
  
  // Add TypeScript support
  ...typescriptEslint.configs.recommended,

  // Configure React plugins
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      'react': eslintPluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // React specific rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-unused-expressions': 'warn',
      'no-duplicate-imports': 'error'
    }
  },
  
  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn'
    }
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.{js,jsx,mjs,cjs}']
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'vite.config.ts',
      'vitest.config.ts',
      'meetup-proxy/**',
      'scripts/**',
      '.venv/**',
      '*.config.{js,mjs,cjs}'
    ]
  }
]; 