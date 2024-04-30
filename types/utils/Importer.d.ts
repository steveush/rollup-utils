import type SourceMap from "./SourceMap";
import type MagicString from "magic-string";
import type {
    NormalizedOutputOptions,
    OutputBundle,
    OutputOptions,
    PluginContext,
    TransformResult,
    TransformPluginContext
} from "rollup";
import type { FilterPattern } from "@rollup/pluginutils";

//region Type Definitions

/**
 * An object representing a module created by the Importer class.
 */
export interface ImporterModule {
    /**
     * The module id. This is the absolute path to the source file.
     */
    id: string,
    /**
     * The type of import to use for this module. If `"default"` then no `with { type }` syntax was used.
     */
    type: string,
    /**
     * The relative file name for the module, this is combined with the output directory to create a final path.
     */
    fileName: string,
    /**
     * The source code for the module.
     */
    code: string,
    /**
     * If the code has been transformed this should contain the source map output by that transformation.
     */
    map?: SourceMap
}

/**
 * An object containing the transformed code and an optional source map, otherwise `null`.
 */
export type ImporterResult = {
    code: string;
    map?: SourceMap
} | null;

/**
 * Process the raw source code applying any transformations like running preprocessors.
 *
 * @this {Importer} - The current instance of the importer.
 * @param {TransformPluginContext} ctx - The current Rollup plugin context.
 * @param {string} code - The source code to process.
 * @param {string} id - The module id of the file being processed.
 * @returns {string | MagicString | ImporterResult} - The transformed result.
 */
export type ImporterTransformCallback = ( this: Importer, ctx: TransformPluginContext, id: string, code: string ) => string | MagicString | ImporterResult;

/**
 * Combine the modules into a single result.
 *
 * @this {Importer} - The current instance of the importer.
 * @param {PluginContext} ctx - The current Rollup plugin context.
 * @param {ReadonlyArray<ImporterModule>} modules - The modules to bundle together.
 * @param {string} fileName - The output file name for the bundle.
 * @returns {string | MagicString | ImporterResult} - The transformed result.
 */
export type ImporterBundleCallback = ( this: Importer, ctx: PluginContext, modules: ReadonlyArray<ImporterModule>, fileName: string ) => string | MagicString | ImporterResult;

/**
 * Produce an inline JavaScript representation of a modules code.
 *
 * This allows for special handling of imports using the `with { type }` syntax.
 *
 * @this {Importer} - The current instance of the importer.
 * @param {TransformPluginContext} ctx - The current Rollup plugin context.
 * @param {ImporterModule} module - The module to produce inline JavaScript for.
 * @returns {string | MagicString | ImporterResult} - The inline JavaScript for the module.
 */
export type ImporterTypeCallback = ( this: Importer, ctx: TransformPluginContext, module: ImporterModule ) => string | MagicString | ImporterResult;

/**
 * Determine whether a module should be operated upon.
 *
 * This function is the result of a call to the Rollup {@link import('@rollup/pluginutils').createFilter|createFilter} method.
 *
 * @param {string | unknown} id - The id of the module to check.
 * @returns {boolean} `true` if the id matches the filter, otherwise `false`.
 */
export type ImporterMatches = ( id: string | unknown ) => boolean;

/**
 * The options for the Importer class.
 */
export interface ImporterOptions {
    /**
     * A valid picomatch glob pattern, or array of patterns of files to include. Defaults to `null`.
     */
    include?: FilterPattern;
    /**
     * A valid picomatch glob pattern, or array of patterns of files to exclude. Defaults to `null`.
     */
    exclude?: FilterPattern;
    /**
     * The output file name for the bundle. If not supplied, the bundle is not created. Defaults to `null`.
     */
    output?: string;
    /**
     * Create a file even if the output is empty. Defaults to `false`.
     */
    outputEmpty?: boolean;
    /**
     * Create source maps for modules that have been converted to inline JavaScript. Defaults to `false`.
     */
    sourcemapInlined?: boolean;
    /**
     * Specifies the source map comment style. Defaults to `"single"`.
     */
    sourcemapComments?: "single" | "multiline";
    /**
     * A callback to process the raw source code applying any transformations like running preprocessors.
     */
    transform?: ImporterTransformCallback;
    /**
     * A callback to combine the modules into a single result.
     */
    bundle?: ImporterBundleCallback;
    /**
     * An object containing a mapping of type names to transform callbacks to change a modules code into inlined JavaScript code.
     */
    types?: Record<string, ImporterTypeCallback>;
}

//endregion

/**
 * A utility class to help create Rollup plugins for importing and transforming text files.
 *
 * @param {ImporterOptions} options - The options to supply for this instance of the class. The only required option is the "include" pattern.
 * @see https://rollupjs.org/plugin-development/ RollupJS.org - Plugin Development
 */
export default class Importer {
    //region Static

    /**
     * The readonly default options for this class.
     */
    static readonly defaults: Readonly<ImporterOptions>;

    /**
     * Merge multiple partial options into a new options object based on the defaults. The original objects are not mutated.
     *
     * Values are assigned left to right, meaning the last objects properties will override those that came before it.
     *
     * @param {...ImporterOptions} options - Any number of option objects to merge.
     * @return {ImporterOptions} - The merged options object.
     */
    static options: ( ...options: ImporterOptions[] ) => ImporterOptions;

    //endregion

    //region Constructor

    /**
     * Create a new instance of the class with the given options.
     *
     * @param {ImporterOptions} [options] - The options to supply for this instance of the class.
     */
    constructor( options?: ImporterOptions );

    //endregion

    //region Properties

    /**
     * Get the combined options to use for this instance.
     */
    readonly options: ImporterOptions;

    /**
     * Get the module cache for this instance.
     */
    readonly cache: Map<string, ImporterModule>;

    //endregion

    //region Build Hooks

    /**
     * Performs transformations on the provided code if the id matches the include and exclude patterns for this instance.
     *
     * The first processes the raw source code applying any transformations like running preprocessors.
     *
     * The second changes the processed module code into JavaScript inlined code if required.
     *
     * @param {TransformPluginContext} ctx - The current Rollup plugin context.
     * @param {string} code - The source code to process.
     * @param {string} id - The module id being processed.
     * @returns {TransformResult} - The result of the transform.
     *
     * @see https://rollupjs.org/plugin-development/#transform RollupJS.org - transform
     */
    transform( ctx: TransformPluginContext, code: string, id: string ): TransformResult;

    // noinspection SpellCheckingInspection - issues with @see urls
    /**
     * Modifies the output options to add source maps created for importer modules to the `x_google_ignoreList`.
     *
     * This is achieved by modifying the {@link https://rollupjs.org/configuration-options/#output-sourcemapignorelist|sourcemapIgnoreList} option,
     * if a function is already supplied it is wrapped returning the result of the original function or whether the
     * relativeSourcePath belongs to an importer module.
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {OutputOptions} options - The current Rollup output options.
     * @returns {OutputOptions|null} - The modified output options object, otherwise `null`.
     *
     * @see https://rollupjs.org/plugin-development/#outputoptions RollupJS.org - outputOptions
     */
    outputOptions( ctx: PluginContext, options: OutputOptions ): OutputOptions | null;

    /**
     * Generates a bundle containing all side effect only importer modules.
     *
     * Side effect only modules are those that are imported without declaring a local variable. i.e. `import "text.txt"`
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {OutputBundle} bundle - The Rollup output bundle.
     * @param {boolean} isWrite - A boolean determining if the current operation should write output files.
     *
     * @see https://rollupjs.org/plugin-development/#generatebundle Rollup generateBundle hook
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import MDN import
     */
    generateBundle( ctx: PluginContext, options: NormalizedOutputOptions, bundle: OutputBundle, isWrite: boolean ): void;

    //endregion

    //region Helper Methods

    /**
     * Check if a module id matches the filter function created using the include and exclude options.
     *
     * @param {string | unknown} id - The id of the module to check.
     * @returns {boolean} - `true` if the id matches the filter, otherwise `false`.
     */
    matches: ImporterMatches;

    /**
     * Check if the supplied code should be output. This takes into account the `outputEmpty` option.
     *
     * @param {string} code - The source code to check.
     * @returns {boolean} - `true` if the code should be output, otherwise `false`.
     */
    shouldOutput( code: string ): boolean;

    /**
     * Make an importer result object from a given value.
     *
     * @param {string | MagicString | ImporterResult} value - The value to convert to a transform result.
     * @param {string} sourcePath - The absolute path of the file being transformed. This is only used when dealing with a MagicString value.
     * @param {SourceMap} [currentMap] - If the file being transformed has a pre-existing source map it can be provided here and will be merged. This is only used when dealing with a MagicString value.
     * @returns {ImporterResult} - The importer result, otherwise `null` if the value could not be parsed.
     */
    makeResult( value: string | MagicString | ImporterResult, sourcePath: string, currentMap?: SourceMap ): ImporterResult;

    /**
     * Make an importer module object.
     *
     * @param {TransformPluginContext} ctx - The current Rollup plugin context.
     * @param {string} id - The module id being processed.
     * @param {string} code - The code to process.
     * @returns {ImporterModule|null} - The importer module, otherwise `null` if the module could not be parsed.
     */
    makeModule( ctx: TransformPluginContext, id: string, code: string ): ImporterModule | null;

    /**
     * Make a bundle from multiple importer modules.
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ReadonlyArray<ImporterModule>} modules - A readonly array of importer modules.
     * @returns {ImporterModule|null} - The combined importer bundle module, otherwise `null`.
     */
    makeBundle( ctx: PluginContext, options: NormalizedOutputOptions, modules: ReadonlyArray<ImporterModule> ): ImporterModule | null;

    /**
     * Get the absolute path to where the bundle file will be output.
     *
     * @param {NormalizedOutputOptions} options - The normalized Rollup output options.
     * @returns {string|null} - The absolute path to the bundle file, otherwise `null`.
     */
    getBundlePath( options: NormalizedOutputOptions ): string;

    /**
     * Get all importer modules that were created but are not included in the current output bundle.
     *
     * @remarks
     * This essentially finds all modules imported without a variable assignment.
     *
     * i.e. `import "some-file.txt"`
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {OutputBundle} bundle - The Rollup output bundle.
     * @return {ReadonlyArray<ImporterModule>} - A readonly array of importer modules.
     */
    getBundleModules( ctx: PluginContext, bundle: OutputBundle ): ReadonlyArray<ImporterModule>;

    /**
     * Perform some checks on a module and additional source map processing before it is output.
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ImporterModule} module - The module to emit.
     */
    emitModule( ctx: PluginContext, options: NormalizedOutputOptions, module: ImporterModule ): void;

    // noinspection SpellCheckingInspection - issues with @link urls
    /**
     * Prepares a source map just prior to module being output.
     *
     * This method takes into account the Rollup {@link https://rollupjs.org/configuration-options/#output-sourcemap|sourcemap}
     * and {@link https://rollupjs.org/configuration-options/#output-sourcemappathtransform|sourcemapPathTransform} options
     *
     * @param {PluginContext} ctx - The current Rollup plugin context.
     * @param {NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ImporterModule} module - The module to prepare.
     * @returns {boolean} - `true` if the map for the supplied module should be output, otherwise `false`.
     */
    prepareSourceMap( ctx: PluginContext, options: NormalizedOutputOptions, module: ImporterModule ): boolean;

    //endregion
};