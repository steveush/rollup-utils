import Importer, { ImporterOptions } from "../../utils/Importer";

/**
 * An {@link Importer} configured for importing HTML files.
 *
 * @param {ImporterOptions} [options] - Optional. The options to supply for this instance of the class.
 */
export default class HtmlImporter extends Importer {
    /**
     * The readonly default options for this class.
     *
     * @returns {Readonly<ImporterOptions>}
     */
    static readonly defaults: Readonly<ImporterOptions>;

    /**
     * Create a new instance of the class with the given options.
     *
     * @param {ImporterOptions} [options] - Optional. The options to supply for this instance of the class.
     */
    constructor( options?: ImporterOptions );
};