import type { PluginContext } from "rollup";

/**
 * Performs the copying of files from one path to another.
 *
 * @param {import('rollup').PluginContext} ctx - The current Rollup plugin context.
 * @param {string} source - The directory to copy files from.
 * @param {string} target - The directory to copy files to.
 * @param {string[]} [patterns] - A string array of patterns used to match the files to copy.
 * @returns {Promise<void>}
 * @remarks Additional information is output via the `ctx.debug` and `ctx.error` methods.
 */
export default async function performCopy( ctx: PluginContext, source: string, target: string, patterns?: string[] ): Promise<void>;