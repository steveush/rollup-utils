'use strict';

const isNonNullable = require('./isNonNullable.cjs');

/**
 * Check if a value is a function.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 */
const isFunction = value => isNonNullable(value) && (Object.prototype.toString.call(value) === "[object Function]" || typeof value === "function" || value instanceof Function);

module.exports = isFunction;
//# sourceMappingURL=isFunction.cjs.map
