import isNonNullable from "./internal/isNonNullable.js";

const SOURCE_MAP_REQUIRED = [ "mappings", "names", "sources", "version" ];

/**
 * @typedef {object} SourceMapLike
 * @property {number|string} version
 * @property {string} [file]
 * @property {string} [sourceRoot]
 * @property {string[]} sources
 * @property {string[]} [sourcesContent]
 * @property {string[]} names
 * @property {string} mappings
 * @property {number[]} [x_google_ignoreList]
 */

/**
 * Check if a value could be a SourceMap.
 *
 * @param {any} value - The value to check.
 * @return {boolean} - `true` if the value could be a SourceMap, otherwise `false`.
 */
const isSourceMapLike = value => {
    if ( isNonNullable( value ) ) {
        const keys = Object.keys( value );
        if ( SOURCE_MAP_REQUIRED.every( prop => keys.includes( prop ) ) ) {
            // we have all the expected props but must also only handle version 3
            switch ( typeof value.version ) {
                case "number":
                    return value.version === 3;
                case "string":
                    return parseInt( value.version ) === 3;
            }
        }
    }
    return false;
};

export default isSourceMapLike;