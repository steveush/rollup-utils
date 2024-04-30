/**
 * Check if a value is a string and optionally if it is not empty.
 *
 * @param {any} value - The value to check.
 * @param {boolean} [notEmpty] Optional. If `true` the value is trimmed and the resulting length must not be zero. Defaults to `false`.
 * @return {boolean} `true` if the value is a string and optionally if it is not empty, otherwise `false`.
 */
export default function isString( value: any, notEmpty?: boolean ): asserts value is string;