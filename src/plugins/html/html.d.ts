import type { Plugin } from "rollup";
import type { ImporterOptions } from "../../utils/Importer";


/**
 * A plugin to import HTML files as part of a Rollup build.
 *
 * This plugin allows importing of `*.htm` and `*.html` files as a `string` or `HTMLTemplateElement`.
 *
 * It does not support importing these extensions without declaring a variable. These side effect modules are ignored
 * by default, however if an "output" file is specified, one will be written using the basic "bundle" callback to
 * combine the modules.
 *
 * @param {ImporterOptions} [options] - Optional. Any options to pass to the importer.
 * @returns {Plugin} - An instance of the `html` Rollup plugin.
 */
export default function html( options?: ImporterOptions ): Plugin;