import { rm } from 'fs/promises';
import toShortTime from '../../utils/internal/toShortTime.js';
import isArray from '../../utils/internal/isArray.js';
import isString from '../../utils/internal/isString.js';

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
    await Promise.all(paths.map(path => rm(path, {
      recursive: true,
      force: true
    })));
    ctx.debug(`cleaned ${dirs} in ${toShortTime(Date.now() - started)}`);
  } catch (err) {
    ctx.error(`clean error: ${err.message}`);
  }
};

export { performClean as default };
//# sourceMappingURL=performClean.js.map
