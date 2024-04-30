import type { ModuleInfo, PluginContext } from "rollup";

/**
 * Get the entry {@link ModuleInfo} for the given module id.
 *
 * @param {PluginContext} ctx - The current Rollup plugin context.
 * @param {string} moduleId - The module id to find the entry info for.
 * @return {ModuleInfo|null} - The entry {@link ModuleInfo} if successful, otherwise `null`.
 */
export default function getEntryInfo( ctx: PluginContext, moduleId: string ): ModuleInfo | null;