import type { PluginContext } from "rollup";

/**
 * Recursively retrieve all imported module ids, in the order they were imported, for a given module.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string} moduleId - The module id to retrieve all imported ids for.
 * @param {boolean} [addSelf=false] - Whether to include the given "moduleId" value in the result.
 * @returns {Readonly<string[]>} - A readonly string array of imported module ids, in the order they were imported, for the given module.
 */
export default function getImportedIds( ctx: PluginContext, moduleId: string, addSelf?: boolean ): Readonly<string[]>;