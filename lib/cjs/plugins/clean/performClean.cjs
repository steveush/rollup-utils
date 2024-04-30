'use strict';

const promises = require('fs/promises');
const toShortTime = require('../../utils/internal/toShortTime.cjs');
const isArray = require('../../utils/internal/isArray.cjs');
const isString = require('../../utils/internal/isString.cjs');

/**
 * Performs the removal of the supplied paths.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string[]} paths - The string array of paths to clean.
 * @returns {Promise<void>}
 * @remarks Additional information is output via the `ctx.debug`, `ctx.error` and `ctx.warn methods.
 */
const performClean = async (ctx, paths) => {
  if (!isArray(paths, true, path => isString(path, true))) {
    ctx.warn('No paths cleaned as the "paths" array was empty or contained values other than strings.');
    return;
  }
  try {
    const dirs = paths.join(", ");
    const started = Date.now();
    ctx.debug(`cleaning ${dirs}...`);
    await Promise.all(paths.map(path => promises.rm(path, {
      recursive: true,
      force: true
    })));
    ctx.debug(`cleaned ${dirs} in ${toShortTime(Date.now() - started)}`);
  } catch (err) {
    ctx.error(`clean error: ${err.message}`);
  }
};

module.exports = performClean;
//# sourceMappingURL=performClean.cjs.map
