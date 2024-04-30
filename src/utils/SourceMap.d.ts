import type { SourceMapLike } from "./isSourceMapLike";

/**
 * Represents a version 3 source map.
 *
 * @param {SourceMapLike} sourceMap - A source map like object containing the properties to initialize the instance with.
 * @see https://tc39.es/source-map/
 */
export default class SourceMap {
    //region static

    /**
     * Merge two source maps together returning the combined result.
     *
     * @param {SourceMapLike|undefined} oldMap - The old source map.
     * @param {SourceMapLike|undefined} newMap - The new source map.
     * @returns {SourceMap|undefined} - The combined source map if the merge was successful, otherwise `undefined`.
     */
    static merge( oldMap: SourceMapLike | undefined, newMap: SourceMapLike | undefined ): SourceMap | undefined;

    /**
     * Get a SourceMap from a source map like object.
     *
     * If the value is already a SourceMap instance, it is simply returned.
     *
     * @param {SourceMapLike|undefined} sourceMap - The value to use.
     * @return {SourceMap|undefined} - A source map if successful, otherwise `undefined`.
     */
    static from( sourceMap: SourceMapLike | undefined ): SourceMap | undefined;

    //endregion

    /**
     * Create a new instance of the class with the given source map like object.
     *
     * @param {SourceMapLike} sourceMap - A source map like object containing the properties to initialize the instance with.
     * @throws {TypeError} - If the sourceMap does not contain at the very least a "version", "sources", "names" and "mappings" properties.
     */
    constructor( sourceMap: SourceMapLike );

    /**
     * The version field which must always be the number `3` as an integer. The source map may be rejected in case of a
     * value different from `3`.
     */
    version: number;

    /**
     * An optional name of the generated code that this source map is associated with. It’s not specified if this can be
     * a URL, relative path name, or just a base name. As such it has a mostly informal character.
     */
    file: string;

    /**
     * An optional source root, useful for relocating source files on a server or removing repeated values in the
     * "sources" field. This value is prepended to the individual entries in the "sources" field.
     */
    sourceRoot?: string;

    /**
     * A list of original sources used by the "mappings" field. Each entry is either a string that is a
     * (potentially relative) URL or null if the source name is not known.
     */
    sources: string[];

    /**
     * An optional list of source content, useful when the original source can’t be hosted. The contents are listed in
     * the same order as the "sources" field. `null` may be used if some original sources should be retrieved by name.
     */
    sourcesContent?: string[];

    /**
     * A list of symbol names used by the mappings entry.
     */
    names: string[];

    /**
     * A string with the encoded mapping data.
     */
    mappings: string;

    /**
     * Identifies third-party sources (such as framework code or bundler-generated code), allowing developers to avoid
     * code that they don't want to see or step through, without having to configure this beforehand.
     *
     * The `x_google_ignoreList` field refers to the `sources` array, and lists the indices of all the known third-party
     * sources in that source map. When parsing the source map, developer tools can use this to determine sections of
     * the code that the browser loads and runs that could be automatically ignore-listed.
     *
     * @see https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.mt2g20loc2ct Source Map Revision 3 Proposal
     * @see https://developer.chrome.com/blog/devtools-modern-web-debugging/ Modern web debugging in Chrome DevTools
     */
    x_google_ignoreList?: number[];

    /**
     * Convert this instance to a JSON stringified object.
     *
     * @return {string}
     */
    toString(): string;

    /**
     * Convert this instance to a JSON data url containing the base64 encoded result of a call to `toString`.
     *
     * @return {string}
     */
    toUrl: string;
};