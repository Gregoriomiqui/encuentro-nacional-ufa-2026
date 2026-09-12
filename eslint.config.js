import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  {
    files: ['src/shared/test/**/*.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/features/*/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: [
            '@features/*/application/**',
            '@features/*/infrastructure/**',
            '@features/*/presentation/**',
            '@app/**',
            '@pages/**',
          ],
          message: 'El dominio solo puede depender del propio dominio o de shared.',
        }],
      }],
    },
  },
  {
    files: ['src/features/*/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: [
            '@features/*/infrastructure/**',
            '@features/*/presentation/**',
            '@app/**',
            '@pages/**',
          ],
          message: 'La aplicación debe depender de puertos y dominio, no de capas externas.',
        }],
      }],
    },
  },
])
