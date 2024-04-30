import isNonNullable from "./isNonNullable.js";

/**
 * Check if a value is a Plain Old JavaScript Object.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is a Plain Old JavaScript Object, otherwise `false`.
 * @category Type Checks
 */
const isPOJO = value => {
    if ( isNonNullable( value ) ) {
        const proto = Object.getPrototypeOf( value );
        return proto === null || proto.constructor === Object;
    }
    return false;
};

export default isPOJO;