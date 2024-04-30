import getImportedIds from './getImportedIds.js';

/**
 * Get the entry {@link import('rollup').ModuleInfo|ModuleInfo} for the given module id.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string} moduleId - The module id to find the entry info for.
 * @return {import('rollup').ModuleInfo|null} - The entry {@link import('rollup').ModuleInfo|ModuleInfo} if successful, otherwise `null`.
 */
const getEntryInfo = (ctx, moduleId) => {
  for (const id of ctx.getModuleIds()) {
    const module = ctx.getModuleInfo(id);
    if (module.isEntry) {
      if (module.id === moduleId) {
        return module;
      }
      const importedIds = getImportedIds(ctx, module.id);
      if (importedIds.some(importedId => importedId === moduleId)) {
        return module;
      }
    }
  }
  return null;
};
const getEntryInfo$1 = getEntryInfo;

export { getEntryInfo$1 as default };
//# sourceMappingURL=getEntryInfo.js.map
