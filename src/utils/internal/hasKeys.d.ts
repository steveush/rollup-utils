/**
 * Check if a Plain Old JavaScript Object has each of the given keys.
 *
 * @param {object} target - The Plain Old JavaScript Object to check.
 * @param {string|string[]|Record<string,((value: any) => boolean)>} [keys] A string key name, string array of key names, or an object containing key names to type check methods.
 * @returns {boolean} `true` if the Plain Old JavaScript Object has each of the given keys, otherwise `false`.
 */
export default function hasKeys( target: object, keys?: ( string | string[] | Record<string, ( ( value: any ) => boolean )> ) ): boolean;