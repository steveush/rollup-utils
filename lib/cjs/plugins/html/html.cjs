'use strict';

const HtmlImporter = require('./HtmlImporter.cjs');

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
 * @returns {import('rollup').Plugin} - An instance of the `html` Rollup plugin.
 */
function html() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const html = new HtmlImporter(options);

  // noinspection JSValidateTypes - the hooks here are not being picked up as valid props of a plugin
  return {
    name: "html",
    transform(code, id) {
      return html.transform(this, code, id);
    },
    generateBundle(options, bundle, isWrite) {
      html.generateBundle(this, options, bundle, isWrite);
    }
  };
}

module.exports = html;
//# sourceMappingURL=html.cjs.map
