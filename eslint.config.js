const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      camelcase: 'warn',
      'eol-last': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'no-tabs': 'error',
      'no-template-curly-in-string': 'error',
      'no-unexpected-multiline': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_(.){0,}$',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_(.){0,}$',
          args: 'all',
          argsIgnorePattern: '^(_(.){0,}|req|res|next)$',
          ignoreRestSiblings: true,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': 'error',
      'prefer-promise-reject-errors': 'warn',
      semi: ['error', 'never'],
      'spaced-comment': [
        'off',
        'never',
        {
          exceptions: [':', '::'],
          markers: ['/*'],
        },
      ],
    },
  },
]
