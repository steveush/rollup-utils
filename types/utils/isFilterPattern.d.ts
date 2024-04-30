/**
 * Check if a value is a Rollup filter pattern.
 *
 * This does not accept `null` as a valid pattern, it checks if the value is a string or RegExp instance, or an array
 * of strings or RegExp instances.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - `true` if the value is a filter pattern, otherwise `false`.
 */
export default function isFilterPattern( value: any ): boolean;