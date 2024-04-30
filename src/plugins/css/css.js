import CssImporter from "./CssImporter.js";

/**
 * A plugin to import CSS, SASS or SCSS files as part of a Rollup build.
 *
 * This plugin allows importing of `*.css`, `*.sass` and `*.scss` files as a `string`, `CSSStyleSheet` or `HTMLStyleElement`.
 *
 * It also allows these extensions to be imported without declaring a variable. These side effect modules are bundled
 * together and output to a `*.css` file matching the current entry name.
 *
 * @param {ImporterOptions} [options] - Optional. Any options to pass to the importer.
 * @returns {import('rollup').Plugin} - An instance of the `css` Rollup plugin.
 */
export default function css( options = {} ) {
    const css = new CssImporter( options );
    // noinspection JSValidateTypes - the hooks here are not being picked up as valid props of a plugin
    return {
        name: "css",
        transform( code, id ) {
            return css.transform( this, code, id );
        },
        outputOptions( options ) {
            return css.outputOptions( this, options );
        },
        generateBundle( options, bundle, isWrite ) {
            css.generateBundle( this, options, bundle, isWrite );
        }
    };
};