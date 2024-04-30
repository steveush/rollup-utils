/**
 * Performs the recursive work for the {@link getImportedIds} method.
 *
 * @param {import('rollup').PluginContext} ctx - The plugin context object.
 * @param {string} moduleId - The module ID.
 * @param {Set<string>} [handled] - The set of handled module IDs.
 * @returns {string[]} - The imported IDs.
 */
const recurse = function (ctx, moduleId) {
  let handled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();
  if (handled.has(moduleId)) return [];
  handled.add(moduleId);
  const result = [moduleId];
  ctx.getModuleInfo(moduleId).importedIds.forEach(importedId => {
    result.push(...recurse(ctx, importedId, handled));
  });
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
const getImportedIds = function (ctx, moduleId) {
  let addSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const importedIds = recurse(ctx, moduleId);
  if (!addSelf) importedIds.shift();
  return Object.freeze(importedIds);
};
const getImportedIds$1 = getImportedIds;

export { getImportedIds$1 as default };
//# sourceMappingURL=getImportedIds.js.map
