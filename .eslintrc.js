module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/no-default-export': ['error'],
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['src/*'],
      },
    ],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
  },
};
