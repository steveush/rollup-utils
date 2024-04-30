import isNonNullable from "./isNonNullable.js";

/**
 * Check if a value is a string and optionally if it is not empty.
 *
 * @param {any} value - The value to check.
 * @param {boolean} [notEmpty] Optional. If `true` the value is trimmed and the resulting length must not be zero. Defaults to `false`.
 * @return {asserts value is string} `true` if the value is a string and optionally if it is not empty, otherwise `false`.
 */
const isString = ( value, notEmpty = false ) => isNonNullable( value ) && typeof value === "string" && ( !notEmpty || ( notEmpty && value.trim().length > 0 ) );

export default isString;