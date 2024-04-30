import type { Plugin } from "rollup";
import type { ImporterOptions } from "../../utils/Importer";

/**
 * A plugin to import CSS, SASS or SCSS files as part of a Rollup build.
 *
 * This plugin allows importing of `*.css`, `*.sass` and `*.scss` files as a `string`, `CSSStyleSheet` or `HTMLStyleElement`.
 *
 * It also allows these extensions to be imported without declaring a variable. These side effect modules are bundled
 * together and output to a `*.css` file matching the current entry name.
 *
 * @param {ImporterOptions} [options] - Optional. Any options to pass to the importer.
 * @returns {Plugin} - An instance of the `css` Rollup plugin.
 */
export default function css( options?: ImporterOptions ): Plugin;