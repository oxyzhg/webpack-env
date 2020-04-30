const _ = require('lodash');

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = _.merge(require('@dotlim/eslint-config').eslint, {
  rules: {
    'no-console': OFF,
    'no-cond-assign': WARN,
    'no-nested-ternary': OFF,
    'no-plusplus': WARN,
    'no-trailing-spaces': ERROR,
    'no-restricted-syntax': OFF,
    'no-underscore-dangle': OFF,
    'prefer-const': OFF,
    'no-param-reassign': OFF,
  },
});
