import type { PluginContext } from "rollup";

/**
 * Performs the removal of the supplied paths.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string[]} paths - The string array of paths to clean.
 * @returns {Promise<void>}
 * @remarks Additional information is output via the `ctx.debug` and `ctx.error` methods.
 */
export default async function performClean( ctx: PluginContext, paths: string[] ): Promise<void>;