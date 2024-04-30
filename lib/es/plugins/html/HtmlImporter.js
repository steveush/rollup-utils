import MagicString from 'magic-string';
import Importer from '../../utils/Importer.js';

/**
 * The default options for the HtmlImporter class.
 *
 * @type {Readonly<ImporterOptions>}
 */
const HTML_IMPORTER_DEFAULTS = Object.freeze(Importer.options({
  include: ["**/*.html", "**/*.htm"],
  types: {
    template: (ctx, module) => {
      return new MagicString(module.code).replaceAll(/`/g, "\\`").prepend("const template = document.createElement( \"template\" );\ntemplate.innerHTML = `").append("`;\nexport default template;");
    }
  }
}));

/**
 * An {@link Importer} configured for importing HTML files.
 *
 * @param {ImporterOptions} [options] - Optional. The options to supply for this instance of the class.
 */
class HtmlImporter extends Importer {
  /**
   * The readonly default options for this class.
   *
   * @returns {Readonly<ImporterOptions>}
   */
  static get defaults() {
    return HTML_IMPORTER_DEFAULTS;
  }

  /**
   * Create a new instance of the class with the given options.
   *
   * @param {ImporterOptions} [options] - Optional. The options to supply for this instance of the class.
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options);
  }
}

export { HtmlImporter as default };
//# sourceMappingURL=HtmlImporter.js.map
