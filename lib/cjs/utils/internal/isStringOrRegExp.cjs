'use strict';

const isString = require('./isString.cjs');

/**
 * Check if a value is a non-empty string or RegExp.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is a non-empty string or RegExp, otherwise `false`.
 */
const isStringOrRegExp = value => isString(value, true) || value instanceof RegExp;

module.exports = isStringOrRegExp;
//# sourceMappingURL=isStringOrRegExp.cjs.map
