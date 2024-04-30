export interface SourceMapLike {
    version: number | string;
    file?: string;
    sourceRoot?: string;
    sources: string[];
    sourcesContent?: string[];
    names: string[];
    mappings: string;
    x_google_ignoreList?: number[];
}

/**
 * Check if a value could be a SourceMap.
 *
 * @param {any} value - The value to check.
 * @return {boolean} `true` if the value could be a SourceMap, otherwise `false`.
 * @see https://tc39.es/source-map/
 */
export default function isSourceMapLike( value: any ): asserts value is SourceMapLike;