'use strict';

/**
 * Returns a nicely formatted short time in either second (s) or millisecond (ms) format.
 *
 * @param {number} timespan - Number of milliseconds to represent.
 * @returns {string} - The formatted timespan.
 */
const toShortTime = timespan => {
  if (timespan > 1000) {
    return (timespan / 1000).toFixed(3).replace(/[.,]?0+$/i, "") + "s";
  }
  return timespan + "ms";
};

module.exports = toShortTime;
//# sourceMappingURL=toShortTime.cjs.map
