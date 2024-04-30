import isFunction from "./isFunction.js";

/**
 * Check if a value is an array and optionally not empty. If a callback is supplied it is used to validate every entry in the array.
 *
 * @param {any} value - The value to check.
 * @param {boolean} [notEmpty] - Optional. If `true` the array must not be empty. Defaults to `false`.
 * @param {( value: any, key: number, iter: array ) => boolean} [callback] - Optional. A callback to validate every entry in the array.
 * @returns {boolean} - `true` if the value is an array and optionally not empty, otherwise `false`.
 */
const isArray = ( value, notEmpty = false, callback ) => {
    if ( Array.isArray( value ) && ( !notEmpty || ( notEmpty && value.length > 0 ) ) ) {
        return isFunction( callback ) ? value.every( callback ) : true;
    }
    return false;
};

export default isArray;