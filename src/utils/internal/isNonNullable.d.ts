/**
 * Check if a value is not `null` or `undefined`.
 *
 * @param {any} value - The value to check.
 * @return {boolean} `true` if the value is not `null` or `undefined`, otherwise `false`.
 */
export default function isNonNullable<T>( value: T ): asserts obj is NonNullable<T>;