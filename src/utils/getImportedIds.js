/**
 * Performs the recursive work for the {@link getImportedIds} method.
 *
 * @param {import('rollup').PluginContext} ctx - The plugin context object.
 * @param {string} moduleId - The module ID.
 * @param {Set<string>} [handled] - The set of handled module IDs.
 * @returns {string[]} - The imported IDs.
 */
const recurse = ( ctx, moduleId, handled = new Set() ) => {
    if ( handled.has( moduleId ) ) return [];
    handled.add( moduleId );

    const result = [ moduleId ];

    ctx.getModuleInfo( moduleId ).importedIds.forEach( ( importedId ) => {
        result.push( ...recurse( ctx, importedId, handled ) );
    } );

    return result;
};

/**
 * Recursively retrieve all imported module ids, in the order they were imported, for a given module.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string} moduleId - The module id to retrieve all imported ids for.
 * @param {boolean} [addSelf=false] - Whether to include the given "moduleId" value in the result.
 * @returns {Readonly<string[]>} - A readonly string array of imported module ids, in the order they were imported, for the given module.
 */
const getImportedIds = ( ctx, moduleId, addSelf = false ) => {
    const importedIds = recurse( ctx, moduleId );
    if ( !addSelf ) importedIds.shift();
    return Object.freeze( importedIds );
};

export default getImportedIds;