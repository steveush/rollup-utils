'use strict';

const isStringOrRegExp = require('./internal/isStringOrRegExp.cjs');
const isArray = require('./internal/isArray.cjs');

/**
 * Check if a value is a Rollup filter pattern.
 *
 * This does not accept `null` as a valid pattern, it checks if the value is a string or RegExp instance, or an array
 * of strings or RegExp instances.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - `true` if the value is a filter pattern, otherwise `false`.
 */
const isFilterPattern = value => isStringOrRegExp(value) || isArray(value, true, isStringOrRegExp);

module.exports = isFilterPattern;
//# sourceMappingURL=isFilterPattern.cjs.map
