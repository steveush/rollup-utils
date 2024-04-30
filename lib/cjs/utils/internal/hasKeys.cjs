'use strict';

const isPOJO = require('./isPOJO.cjs');
const isString = require('./isString.cjs');
const isFunction = require('./isFunction.cjs');

/**
 * Check if a Plain Old JavaScript Object has each of the given keys.
 *
 * @param {object} target - The Plain Old JavaScript Object to check.
 * @param {string|string[]|Record<string,((value: any) => boolean)>} [keys] A string key name, string array of key names, or an object containing key names to type check methods.
 * @returns {boolean} `true` if the Plain Old JavaScript Object has each of the given keys, otherwise `false`.
 */
const hasKeys = (target, keys) => {
  if (isPOJO(target)) {
    const targetKeys = Object.keys(target);
    if (keys !== undefined) {
      if (isString(keys)) return targetKeys.includes(keys);
      if (Array.isArray(keys)) return keys.every(key => targetKeys.includes(key));
      if (isPOJO(keys)) {
        return Object.entries(keys).every(_ref => {
          let [key, callback] = _ref;
          if (targetKeys.includes(key) && isFunction(callback)) {
            return Boolean(callback(target[key]));
          }
          return false;
        });
      }
    }
    return targetKeys.length > 0;
  }
  return false;
};

module.exports = hasKeys;
//# sourceMappingURL=hasKeys.cjs.map
