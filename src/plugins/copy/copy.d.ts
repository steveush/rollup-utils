import type { Plugin } from "rollup";

/**
 * A plugin to copy files from one directory to another as part of a Rollup build.
 *
 * This uses the {@link https://rollupjs.org/plugin-development/#writebundle|writeBundle} hook to copy files matching
 * the {@link https://github.com/sindresorhus/globby?tab=readme-ov-file#globbypatterns-options|globby patterns} from one directory to another.
 *
 * @param {string} source - The directory to copy files from.
 * @param {string} target - The directory to copy files to.
 * @param {string[]} [patterns] - Optional. A string array of {@link https://github.com/sindresorhus/globby?tab=readme-ov-file#globbypatterns-options|globby patterns} used to match the files to copy. Defaults to all files.
 * @return {Plugin} - An instance of the `copy` Rollup plugin.
 * @see https://rollupjs.org/plugin-development/#plugins-overview RollupJS.org - Plugin Development
 * @see https://rollupjs.org/plugin-development/#build-hooks RollupJS.org - Build Hooks
 */
export default function copy( source: string, target: string, patterns?: string[] ): Plugin;