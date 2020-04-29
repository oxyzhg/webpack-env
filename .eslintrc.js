const _ = require('lodash');

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = _.merge(require('@dotlim/eslint-config').eslint, {
  rules: {
    'no-console': OFF,
    'no-underscore-dangle': OFF,
    'no-cond-assign': WARN,
    'no-plusplus': WARN,
    'no-trailing-spaces': ERROR,
    'no-restricted-syntax': OFF,
    'prefer-const': OFF,
    'no-param-reassign': OFF,
  },
});
