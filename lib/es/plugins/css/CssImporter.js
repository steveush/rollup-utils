import MagicString from 'magic-string';
import * as sass from 'sass';
import Importer from '../../utils/Importer.js';
import SourceMap from '../../utils/SourceMap.js';

/**
 * An instance of the SASS compiler so it can be used across multiple calls to the transform callback.
 *
 * @type {import('sass').Compiler}
 */
const SASS_COMPILER = sass.initCompiler();

/**
 * The default options for the CSSTransformer class.
 *
 * @type {Readonly<ImporterOptions>}
 */
const CSS_IMPORTER_DEFAULTS = Object.freeze(Importer.options({
  include: ["**/*.css", "**/*.scss", "**/*.sass"],
  output: "[name].css",
  sourcemapComments: "multiline",
  transform: (ctx, code, id) => {
    const result = SASS_COMPILER.compile(id, {
      sourceMap: true,
      sourceMapIncludeSources: true,
      style: "compressed"
    });
    return {
      code: result.css,
      map: SourceMap.from(result.sourceMap)
    };
  },
  types: {
    css: (ctx, module) => {
      return new MagicString(module.code).replaceAll(/`/g, "\\`").prepend("const sheet = new CSSStyleSheet();\nsheet.replaceSync(`").append("`);\nexport default sheet;");
    },
    style: (ctx, module) => {
      return new MagicString(module.code).replaceAll(/`/g, "\\`").prepend("const style = document.createElement( \"style\" );\nstyle.textContent = `").append("`;\nexport default style;");
    }
  }
}));

/**
 * An {@link Importer} configured for importing CSS, SASS and SCSS files.
 *
 * @param {ImporterOptions} [options] - Optional. The options to supply for this instance of the class.
 */
class CssImporter extends Importer {
  /**
   * The readonly default options for this class.
   *
   * @returns {Readonly<ImporterOptions>}
   */
  static get defaults() {
    return CSS_IMPORTER_DEFAULTS;
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

export { CssImporter as default };
//# sourceMappingURL=CssImporter.js.map
