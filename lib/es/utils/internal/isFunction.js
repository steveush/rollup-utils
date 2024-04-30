import isNonNullable from './isNonNullable.js';

/**
 * Check if a value is a function.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 */
const isFunction = value => isNonNullable(value) && (Object.prototype.toString.call(value) === "[object Function]" || typeof value === "function" || value instanceof Function);

export { isFunction as default };
//# sourceMappingURL=isFunction.js.map
