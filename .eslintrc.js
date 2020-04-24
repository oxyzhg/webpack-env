const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/standard',
    'prettier/react',
    'prettier/vue',
  ],
  rules: {
    'no-console': OFF,
    'no-underscore-dangle': OFF,
    'no-cond-assign': WARN,
    'no-plusplus': WARN,
    'no-trailing-spaces': ERROR,
    'no-restricted-syntax': OFF,
    'prefer-const': OFF,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
      impliedStrict: true,
      experimentalObjectRestSpread: true,
    },
    allowImportExportEverywhere: false,
  },
};
