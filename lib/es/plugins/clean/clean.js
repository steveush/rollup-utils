import { dirname } from 'path';
import isArray from '../../utils/internal/isArray.js';
import isString from '../../utils/internal/isString.js';
import performClean from './performClean.js';

/**
 * A plugin to clean paths as part of a Rollup build.
 *
 * By default, if no `paths` are supplied, this uses the `output.dir` or the `output.file` {@link https://rollupjs.org/configuration-options/|configuration options}
 * in the {@link https://rollupjs.org/plugin-development/#renderstart|renderStart} hook to automatically find the path to clean as this is
 * the earliest the {@link https://rollupjs.org/javascript-api/#outputoptions-object|output options} object is made available to hooks.
 *
 * If the `paths` are supplied, the {@link https://rollupjs.org/javascript-api/#outputoptions-object|output options} are no longer needed
 * so the clean is performed in the earlier {@link https://rollupjs.org/plugin-development/#buildstart|buildStart} hook.
 *
 * @param {string[]} [paths] - Optional. A string array of paths to clean. Defaults to `undefined`.
 * @returns {import('rollup').Plugin} - An instance of the `clean` Rollup plugin.
 * @see https://rollupjs.org/plugin-development/#plugins-overview RollupJS.org - Plugin Development
 * @see https://rollupjs.org/plugin-development/#build-hooks RollupJS.org - Build Hooks
 */
function clean(paths) {
  if (isArray(paths, true, p => isString(p, true))) {
    // noinspection JSValidateTypes - buildStart is not recognized as a known property despite it being a valid hook
    return {
      name: "clean",
      buildStart: {
        order: "pre",
        sequential: true,
        async handler() {
          await performClean(this, paths);
        }
      }
    };
  } else {
    return {
      name: "clean",
      renderStart: {
        order: "pre",
        sequential: true,
        async handler(options) {
          const path = options.dir ?? dirname(options.file);
          await performClean(this, [path]);
        }
      }
    };
  }
}

export { clean as default };
//# sourceMappingURL=clean.js.map
