import { createFilter } from "@rollup/pluginutils";
import { fileURLToPath } from "url";
import { basename, dirname, isAbsolute, join, relative, resolve, extname } from "path";
import MagicString from "magic-string";

import getEntryInfo from "./getEntryInfo.js";
import getImportedIds from "./getImportedIds.js";
import isFilterPattern from "./isFilterPattern.js";

import isFunction from "./internal/isFunction.js";
import isNonNullable from "./internal/isNonNullable.js";
import isPOJO from "./internal/isPOJO.js";
import isString from "./internal/isString.js";
import hasKeys from "./internal/hasKeys.js";
import SourceMap from "./SourceMap.js";

//region Type Definitions

/**
 * An object representing a module created by the Importer class.
 *
 * @typedef {object} ImporterModule
 * @property {string} id - The module id. This is the absolute path to the source file.
 * @property {string} type - The type of import to use for this module. If `"default"` then no `with { type }` syntax was used.
 * @property {string} fileName - The relative file name for the module, this is combined with the output directory to create a final path.
 * @property {string} code - The source code for the module.
 * @property {SourceMap} [map] - If the code has been transformed this should contain the source map output by that transformation.
 */

/**
 * An object containing the transformed code and an optional source map, otherwise `null`.
 *
 * @typedef {{code: string, map?: SourceMap}|null} ImporterResult
 */

/**
 * Process the raw source code applying any transformations like running preprocessors.
 *
 * @callback ImporterTransformCallback
 * @this {Importer} - The current instance of the importer.
 * @param {import('rollup').TransformPluginContext} ctx - The current Rollup plugin context.
 * @param {string} code - The source code to process.
 * @param {string} id - The module id of the file being processed.
 * @returns {string | MagicString | ImporterResult} - The transformed result.
 */

/**
 * Combine the modules into a single result.
 *
 * @callback ImporterBundleCallback
 * @this {Importer} - The current instance of the importer.
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {ReadonlyArray<ImporterModule>} modules - The modules to bundle together.
 * @param {string} fileName - The output file name for the bundle.
 * @returns {string | MagicString | ImporterResult} - The transformed result.
 */

/**
 * Produce an inline JavaScript representation of a modules code.
 *
 * This allows for special handling of imports using the `with { type }` syntax.
 *
 * @callback ImporterTypeCallback
 * @this {Importer} - The current instance of the importer.
 * @param {import('rollup').TransformPluginContext} ctx - The current Rollup plugin context.
 * @param {ImporterModule} module - The module to produce inline JavaScript for.
 * @returns {string | MagicString | ImporterResult} - The inline JavaScript for the module.
 */

/**
 * Determine whether a module should be operated upon.
 *
 * This function is the result of a call to the Rollup {@link import('@rollup/pluginutils').createFilter|createFilter} method.
 *
 * @callback ImporterMatches
 * @param {string} id - The id of the module to check.
 * @returns {boolean} `true` if the id matches the filter, otherwise `false`.
 */

/**
 * The options for the Importer class.
 *
 * @typedef {object} ImporterOptions
 * @property {import('@rollup/pluginutils').FilterPattern} [include] - A valid picomatch glob pattern, or array of patterns of files to include. Defaults to `null`.
 * @property {import('@rollup/pluginutils').FilterPattern} [exclude] - A valid picomatch glob pattern, or array of patterns of files to exclude. Defaults to `null`.
 * @property {string|null} [output] - The output file name for the bundle. If not supplied, the bundle is not created. Defaults to `null`.
 * @property {boolean} [outputEmpty] - Create a file even if the output is empty. Defaults to `false`.
 * @property {boolean} [sourcemapInlined] - Create source maps for modules that have been converted to inline JavaScript. Defaults to `false`.
 * @property {"single"|"multiline"} [sourcemapComments] - Specifies the source map comment style. Defaults to `"single"`.
 * @property {ImporterTransformCallback} [transform] - A callback to process the raw source code applying any transformations like running preprocessors.
 * @property {ImporterBundleCallback} [bundle] - A callback to combine the modules into a single result.
 * @property {Record<string, ImporterTypeCallback>} [types] - An object containing a mapping of type names to transform callbacks to change the processed source code into JavaScript inlined code.
 */

//endregion

/**
 * The default options for the Importer class.
 *
 * @type {Readonly<ImporterOptions>}
 */
const IMPORTER_DEFAULTS = Object.freeze( {
    include: null,
    exclude: null,
    output: null,
    outputEmpty: false,
    sourcemapInlined: false,
    sourcemapComments: "single",
    transform: ( ctx, code ) => {
        return { code };
    },
    bundle: ( ctx, modules ) => {
        return modules.reduce( ( result, module, i ) => {
            if ( i !== 0 ) result.code += "\n";
            result.code += module.code;
            if ( module.map instanceof SourceMap ) {
                result.map = SourceMap.merge( result.map, module.map );
            }
            return result;
        }, { code: "", map: undefined } );
    },
    types: {
        default: ( ctx, module ) => {
            return new MagicString( module.code )
                .replaceAll( /`/g, "\\`" )
                .prepend( "export default `" )
                .append( "`;" );
        }
    }
} );

/**
 * A utility class to help create Rollup plugins for importing and transforming text files.
 *
 * @param {ImporterOptions} options - The options to supply for this instance of the class. The only required option is the "include" pattern.
 * @see https://rollupjs.org/plugin-development/ RollupJS.org - Plugin Development
 */
export default class Importer {
    // region Static

    /**
     * The readonly default options for this class.
     *
     * @type {Readonly<ImporterOptions>}
     * @readonly
     */
    static get defaults() {
        return IMPORTER_DEFAULTS;
    };

    /**
     * Merge multiple partial options into a new options object based on the defaults. The original objects are not mutated.
     *
     * Values are assigned left to right, meaning the last objects properties will override those that came before it.
     *
     * @param {...ImporterOptions} options - Any number of option objects to merge.
     * @return {ImporterOptions} - The merged options object.
     */
    static options( ...options ) {
        return options.reduce( ( result, current ) => {
            if ( isPOJO( current ) ) {
                return {
                    ...result,
                    ...current,
                    types: {
                        ...result.types,
                        ...( current?.types ?? {} )
                    }
                };
            }
            return result;
        }, {
            ...this.defaults,
            types: {
                ...this.defaults.types
            }
        } );
    }

    //endregion

    //region Constructor

    /**
     * Create a new instance of the class with the given options.
     *
     * @param {ImporterOptions} [options] - The options to supply for this instance of the class. The only required option is the "include" pattern.
     */
    constructor( options = {} ) {
        this.#options = this.constructor.options( options );
        if ( !isFilterPattern( this.options.include ) )
            throw new Error( "The `include` option is required." );

        this.#matches = createFilter( this.options.include, this.options.exclude );
        if ( !isFunction( this.#matches ) )
            throw new Error( "Unexpected result from a call to `createFilter`. Check the values passed for the `include` and `exclude` options are valid filter patterns." );

        this.#cache = new Map();
    }

    /**
     * @type {T}
     * @private
     */
    #options;
    /**
     * @type {Map<string, ImporterModule>}
     * @private
     */
    #cache;
    /**
     * @type {ImporterMatches}
     * @private
     */
    #matches;

    //endregion

    //region Properties

    /**
     * Get the combined options to use for this instance.
     *
     * @return {T}
     */
    get options() {
        return this.#options;
    }


    /**
     * Get the module cache for this instance.
     *
     * @returns {Map<string, ImporterModule>}
     */
    get cache() {
        return this.#cache;
    }

    //endregion

    //region Build Hooks

    /**
     * Performs transformations on the provided code if the id matches the include and exclude patterns for this instance.
     *
     * The first processes the raw source code applying any transformations like running preprocessors.
     *
     * The second changes the processed module code into JavaScript inlined code if required.
     *
     * @param {import('rollup').TransformPluginContext} ctx - The current Rollup plugin context.
     * @param {string} code - The source code to process.
     * @param {string} id - The module id being processed.
     * @returns {import('rollup').TransformResult} - The result of the transform.
     *
     * @see https://rollupjs.org/plugin-development/#transform RollupJS.org - transform
     */
    transform( ctx, code, id ) {
        // return undefined for all non-matching modules so that they can undergo default or additional plugin processing
        if ( !this.matches( id ) ) return;

        const module = this.makeModule( ctx, id, code );
        if ( !isNonNullable( module ) ) {
            this.cache.delete( id );
            return null;
        }
        this.cache.set( id, module );

        if ( hasKeys( this.options.types, { [ module.type ]: isFunction } ) ) {
            const result = this.options.types[ module.type ].call( this, ctx, module );
            const transform = this.makeResult( result, module.id, module.map );
            if ( transform !== null ) {
                if ( this.options.sourcemapInlined && transform.map instanceof SourceMap ) {
                    return {
                        code: transform.code,
                        map: transform.map
                    };
                }
                return {
                    code: transform.code,
                    map: { mappings: "" }
                };
            }
        }
        return null;
    }

    // noinspection SpellCheckingInspection - issues with @see urls
    /**
     * Modifies the output options to add source maps created for importer modules to the `x_google_ignoreList`.
     *
     * This is achieved by modifying the {@link https://rollupjs.org/configuration-options/#output-sourcemapignorelist|sourcemapIgnoreList} option,
     * if a function is already supplied it is wrapped returning the result of the original function or whether the
     * relativeSourcePath belongs to an importer module.
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').OutputOptions} options - The current Rollup output options.
     * @returns {import('rollup').OutputOptions|null} - The modified output options object, otherwise `null`.
     *
     * @see https://rollupjs.org/plugin-development/#outputoptions RollupJS.org - outputOptions
     */
    outputOptions( ctx, options ) {
        // always add the sourcemaps handled by this transform instance to the Rollup ignore list
        if ( isFunction( options.sourcemapIgnoreList ) ) {
            const original = options.sourcemapIgnoreList;
            options.sourcemapIgnoreList = ( relativeSourcePath, sourcemapPath ) => {
                return original( relativeSourcePath, sourcemapPath ) || this.matches( resolve( relativeSourcePath ) );
            };
        } else {
            options.sourcemapIgnoreList = relativeSourcePath => this.matches( resolve( relativeSourcePath ) );
        }
        return options;
    }

    /**
     * Generates a bundle containing all side effect only importer modules.
     *
     * Side effect only modules are those that are imported without declaring a local variable. i.e. `import "text.txt"`
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {import('rollup').OutputBundle} bundle - The Rollup output bundle.
     * @param {boolean} isWrite - A boolean determining if the current operation should write output files.
     *
     * @see https://rollupjs.org/plugin-development/#generatebundle RollupJS.org - generateBundle
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import MDN - import
     */
    generateBundle( ctx, options, bundle, isWrite ) {
        if ( !isWrite ) return;
        const modules = this.getBundleModules( ctx, bundle );
        if ( options.preserveModules ) {
            modules.forEach( module => this.emitModule( ctx, options, module ) );
        } else {
            const bundled = this.makeBundle( ctx, options, modules );
            if ( bundled !== null ) {
                this.emitModule( ctx, options, bundled );
            }
        }
    }

    //endregion

    //region Helper Methods

    /**
     * Check if a module id matches the filter function created using the include and exclude options.
     *
     * @param {string} id - The id of the module to check.
     * @returns {boolean} - `true` if the id matches the filter, otherwise `false`.
     */
    matches( id ) {
        return this.#matches( id );
    }

    /**
     * Check if the supplied code should be output. This takes into account the `outputEmpty` option.
     *
     * @param {string} code - The source code to check.
     * @returns {boolean} - `true` if the code should be output, otherwise `false`.
     */
    shouldOutput( code ) {
        return this.options.outputEmpty || isString( code, true );
    }

    /**
     * Make an importer result object from a given value.
     *
     * @param {string | MagicString | ImporterResult} value - The value to convert to a transform result.
     * @param {string} sourcePath - The absolute path of the file being transformed. This is only used when dealing with a MagicString value.
     * @param {SourceMap} [currentMap] - If the file being transformed has a pre-existing source map it can be provided here and will be merged. This is only used when dealing with a MagicString value.
     * @returns {ImporterResult} - The importer result, otherwise `null` if the value could not be parsed.
     */
    makeResult( value, sourcePath, currentMap ) {
        if ( isString( value ) ) {
            return { code: value };
        }
        if ( hasKeys( value, { code: isString } ) ) {
            return value;
        }
        if ( value instanceof MagicString && isAbsolute( sourcePath ) ) {
            return {
                code: value.toString(),
                map: SourceMap.merge( currentMap, value.generateMap( {
                    file: basename( sourcePath ) + ".map",
                    source: sourcePath,
                    includeContent: true
                } ) )
            };
        }
        return null;
    }

    /**
     * Make an importer module object.
     *
     * @param {import('rollup').TransformPluginContext} ctx - The current Rollup plugin context.
     * @param {string} id - The module id being processed.
     * @param {string} code - The code to process.
     * @returns {ImporterModule|null} - The importer module, otherwise `null` if the module could not be parsed.
     */
    makeModule( ctx, id, code ) {
        const module = ctx.getModuleInfo( id );
        if ( !module ) {
            ctx.error( `Unable to retrieve the module info for moduleId = "${ id }".` );
            return null;
        }
        const entry = getEntryInfo( ctx, module.id );
        if ( !entry ) {
            ctx.error( `Unable to retrieve the entry info for moduleId = "${ module.id }".` );
            return null;
        }

        if ( isFunction( this.options.transform ) ) {
            const callbackResult = this.options.transform.call( this, ctx, code, id );
            const transformed = this.makeResult( callbackResult, id );
            if ( transformed !== null ) {
                return {
                    id,
                    type: module.attributes?.type ?? "default",
                    fileName: relative( dirname( entry.id ), module.id ),
                    code: transformed.code,
                    map: transformed.map
                };
            }
        }
        return null;
    }

    /**
     * Make a bundle from multiple importer modules.
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ReadonlyArray<ImporterModule>} modules - A readonly array of importer modules.
     * @returns {ImporterModule|null} - The combined importer bundle module, otherwise `null`.
     */
    makeBundle( ctx, options, modules ) {
        if ( isString( this.options.output, true ) ) {
            const path = this.getBundlePath( options );
            if ( path === null || !isAbsolute( path ) ) {
                ctx.warn( 'Unable to create bundle, make sure either a "output.dir" or "output.file" option is specified.' );
                return null;
            }
            const ext = extname( path );
            const name = basename( path, ext );
            const fileName = this.options.output.replaceAll( "[name]", name ).replaceAll( "[ext]", ext );

            if ( isFunction( this.options.bundle ) ) {
                const result = this.options.bundle.call( this, ctx, modules, fileName );
                const bundled = this.makeResult( result, fileName );
                if ( bundled !== null ) {
                    return {
                        id: fileName,
                        type: "default",
                        fileName: fileName,
                        code: bundled.code,
                        map: bundled.map
                    };
                }
            }
        }
        return null;
    }

    /**
     * Get the absolute path to where the bundle file will be output.
     *
     * @param {import('rollup').NormalizedOutputOptions} options - The normalized Rollup output options.
     * @returns {string|null} - The absolute path to the bundle file, otherwise `null`.
     */
    getBundlePath( options ) {
        let path = null;
        if ( isString( options.file, true ) ) {
            path = options.file;
        }
        if ( isString( options.dir, true ) ) {
            path = join( options.dir, "bundle.js" );
        }
        if ( isString( path ) ) {
            return resolve( path );
        }
        return null;
    }

    /**
     * Get all importer modules that were created but are not included in the current output bundle.
     *
     * @remarks
     * Finds all modules imported without a variable assignment, i.e. modules with side effects.
     *
     * e.g. `import "some-file.txt"` NOT `import val from "some-file.txt"`
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').OutputBundle} bundle - The Rollup output bundle.
     * @return {ReadonlyArray<ImporterModule>} - A readonly array of importer modules.
     */
    getBundleModules( ctx, bundle ) {
        const entryId = Object.values( bundle ).find( assetOrChunk => assetOrChunk.type === "chunk" && typeof assetOrChunk.facadeModuleId === "string" )?.facadeModuleId ?? null;
        if ( !entryId ) return Object.freeze( [] );

        // create a flat object containing all rendered modules in the output bundle
        const renderedModules = Object.keys( bundle ).reduce( ( modules, fileName ) => Object.assign( modules, bundle[ fileName ].modules ), {} );
        // create a filter callback that checks if the given id has been rendered and whether the supplied code should be output.
        const isNotBundled = ( { id, code } ) => !renderedModules[ id ] && this.shouldOutput( code );

        // we need to get the order the modules were imported in to ensure we have no issues in the output code
        const importedIds = getImportedIds( ctx, entryId, true );
        // create a sort comparer that uses the module ids to ensure the array is sorted into the import order
        const byImportedOrder = ( { id: a }, { id: b } ) => importedIds.indexOf( a ) - importedIds.indexOf( b );

        const modules = Array.from( this.#cache.values() )
            .filter( isNotBundled )
            .sort( byImportedOrder );

        return Object.freeze( modules );
    }

    /**
     * Perform some checks on a module and additional source map processing before it is output.
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ImporterModule} module - The module to emit.
     */
    emitModule( ctx, options, module ) {
        if ( module !== null && this.shouldOutput( module.code ) ) {
            let outputSourceMap = this.prepareSourceMap( ctx, options, module );
            ctx.emitFile( {
                type: "asset",
                fileName: module.fileName,
                source: module.code
            } );
            if ( outputSourceMap ) {
                ctx.emitFile( {
                    type: "asset",
                    fileName: module.fileName + ".map",
                    source: module.map.toString()
                } );
            }
        }
    }

    // noinspection SpellCheckingInspection - issues with @link urls
    /**
     * Prepares a source map just prior to module being output.
     *
     * This method takes into account the Rollup {@link https://rollupjs.org/configuration-options/#output-sourcemap|sourcemap}
     * and {@link https://rollupjs.org/configuration-options/#output-sourcemappathtransform|sourcemapPathTransform} options
     *
     * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
     * @param {import('rollup').NormalizedOutputOptions} options - The normalized Rollup output options.
     * @param {ImporterModule} module - The module to prepare.
     * @returns {boolean} - `true` if the map for the supplied module should be output, otherwise `false`.
     */
    prepareSourceMap( ctx, options, module ) {
        if ( Boolean( options.sourcemap ) && module.map instanceof SourceMap ) {
            const dir = options.dir ?? dirname( options.file );
            const filePath = resolve( join( dir, module.fileName ) );
            const sourcemapPath = filePath + ".map";

            // use the basename of the absolute path as the file value as the location of the source map is assumed to be adjacent to the bundle.
            module.map.file = basename( filePath );
            module.map.sources = module.map.sources.map( source => {
                if ( isString( source, true ) ) {
                    if ( isString( module.map.sourceRoot, true ) ) source = join( module.map.sourceRoot, source );
                    if ( isString( source ) && source.startsWith( "file:" ) ) source = fileURLToPath( source );
                    if ( !isAbsolute( source ) ) source = resolve( source );

                    const relativeSourcePath = relative( dir, source ).replace( /[\/\\]/g, "/" );
                    if ( isFunction( options.sourcemapPathTransform ) ) {
                        return options.sourcemapPathTransform( relativeSourcePath, sourcemapPath );
                    }
                    return relativeSourcePath;
                }
                return source;
            } );

            const multiline = this.options.sourcemapComments === "multiline";
            if ( options.sourcemap === true ) {
                module.code = SourceMap.setComment( module.code, module.map.file + ".map", multiline );
            }
            if ( options.sourcemap === "inline" ) {
                module.code = SourceMap.setComment( module.code, module.map.toUrl(), multiline );
            }
            return options.sourcemap === true || options.sourcemap === "hidden";
        }
        return false;
    }
};