/**
 * Check if a value is not `null` or `undefined`.
 *
 * @param {any} value - The value to check.
 * @return {boolean} `true` if the value is not `null` or `undefined`, otherwise `false`.
 */
const isNonNullable = value => value !== null && value !== undefined;

export default isNonNullable;