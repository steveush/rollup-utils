/**
 * Check if a value is a Plain Old JavaScript Object.
 *
 * @param {any} value - The value to check.
 * @returns {value is { [key: string]: any }} `true` if the value is a Plain Old JavaScript Object, otherwise `false`.
 * @category Type Checks
 */
export default function isPOJO( value: any ): value is { [key: string]: any };