import toShortTime from '../../utils/internal/toShortTime.js';
import { globby } from 'globby';
import { join, dirname } from 'path';
import { mkdir, copyFile } from 'fs/promises';
import isString from '../../utils/internal/isString.js';
import isArray from '../../utils/internal/isArray.js';

/**
 * Performs the copying of files from one path to another.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string} source - The directory to copy files from.
 * @param {string} target - The directory to copy files to.
 * @param {string[]} [patterns] - Optional. A string array of {@link https://github.com/sindresorhus/globby?tab=readme-ov-file#globbypatterns-options|globby patterns} used to match the files to copy. Defaults to all files.
 * @returns {Promise<void>}
 * @remarks Additional information is output via the `ctx.debug`, `ctx.error` and `ctx.warn` methods.
 */
const performCopy = async function (ctx, source, target) {
  let patterns = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ["**/*"];
  if (!isString(source, true) || !isString(target, true)) {
    ctx.warn('No files copied as either the "from" or "to" paths were empty or not strings.');
    return;
  }
  if (!isArray(patterns, true, p => isString(p, true))) {
    ctx.warn('No files copied as the "patterns" array was empty or contained values other than strings.');
    return;
  }
  try {
    const started = Date.now();
    ctx.debug(`copying ${source} to ${target}...`);
    const found = await globby(patterns, {
      cwd: source
    });
    await Promise.all(found.map(file => {
      const output = join(target, file);
      return mkdir(dirname(output), {
        recursive: true
      }).then(() => copyFile(join(source, file), output));
    }));
    ctx.debug(`copied ${source} in ${toShortTime(Date.now() - started)}`);
  } catch (err) {
    ctx.error(`copy error: ${err.message}`);
  }
};

export { performCopy as default };
//# sourceMappingURL=performCopy.js.map
