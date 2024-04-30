'use strict';

const mergeSourceMap = require('merge-source-map');
const isSourceMapLike = require('./isSourceMapLike.cjs');
const isString = require('./internal/isString.cjs');
const isArray = require('./internal/isArray.cjs');

/**
 * Represents a version 3 source map.
 *
 * @param {SourceMapLike} sourceMap - A source map like object containing the properties to initialize the instance with.
 * @see https://tc39.es/source-map/
 */
class SourceMap {
  //region static

  /**
   * Merge two source maps together returning the combined result.
   *
   * @param {SourceMapLike|undefined} oldMap - The old source map.
   * @param {SourceMapLike|undefined} newMap - The new source map.
   * @returns {SourceMap|undefined} - The combined source map if the merge was successful, otherwise `undefined`.
   */
  static merge(oldMap, newMap) {
    return this.from(mergeSourceMap(oldMap, newMap));
  }

  /**
   * Get a SourceMap from a source map like object.
   *
   * If the value is already a SourceMap instance, it is simply returned.
   *
   * @param {SourceMapLike|undefined} sourceMap - The value to use.
   * @return {SourceMap|undefined} - A source map if successful, otherwise `undefined`.
   */
  static from(sourceMap) {
    if (isSourceMapLike(sourceMap)) {
      if (sourceMap instanceof SourceMap) {
        return sourceMap;
      }
      return new SourceMap(sourceMap);
    }
  }

  /**
   * Match all multiline sourceMappingUrl comments.
   * @type {RegExp}
   */
  static COMMENT_MULTILINE = /(\r?\n)?\/\*# sourceMappingURL=.*?\s\*\//g;

  /**
   * Match all single line sourceMappingUrl comments.
   * @type {RegExp}
   */
  static COMMENT_SINGLE = /(\r?\n)?\/\/# sourceMappingURL=.*?$/g;

  /**
   * Set the #sourceMappingUrl comment for the source using the specified url.
   *
   * @param {string} source - The source code to add the comment to.
   * @param {string} url - The url for the comment.
   * @param {boolean} [multiline] - Optional. Specifies how the comment is generated, `true` will create the comment
   * using multiline syntax, otherwise it uses single line syntax. Defaults to `false`.
   * @returns {string|null} The modified source if successful, otherwise `null`.
   */
  static setComment(source, url) {
    let multiline = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (isString(source) && isString(url, true)) {
      const sourceMappingURL = `# sourceMappingURL=${url}`;
      const comment = multiline ? `/*${sourceMappingURL} */` : `//${sourceMappingURL}`;
      const stripped = source.replaceAll(this.COMMENT_MULTILINE, "").replaceAll(this.COMMENT_SINGLE, "");
      return stripped + "\n" + comment;
    }
    return null;
  }

  //endregion

  /**
   * Create a new instance of the class with the given source map like object.
   *
   * @param {SourceMapLike} sourceMap - A source map like object containing the properties to initialize the instance with.
   * @throws {TypeError} - If the sourceMap does not contain at the very least a "version", "sources", "names" and "mappings" properties.
   */
  constructor(sourceMap) {
    if (!isSourceMapLike(sourceMap)) {
      throw new TypeError("The given 'sourceMap' is not a source map like object.");
    }
    this.sources = sourceMap.sources;
    this.names = sourceMap.names;
    this.mappings = sourceMap.mappings;
    if (isString(sourceMap.file, true)) {
      this.file = sourceMap.file;
    }
    if (isString(sourceMap.sourceRoot, true)) {
      this.sourceRoot = sourceMap.sourceRoot;
    }
    if (isArray(sourceMap.sourcesContent, true, item => isString(item, true))) {
      this.sourcesContent = sourceMap.sourcesContent;
    }
    if (isArray(sourceMap.x_google_ignoreList, true, item => typeof item === "number")) {
      this.x_google_ignoreList = sourceMap.x_google_ignoreList;
    }
  }

  /**
   * The version field which must always be the number `3` as an integer. The source map may be rejected in case of a
   * value different from `3`.
   *
   * @type {number}
   */
  version = 3;

  /**
   * An optional name of the generated code that this source map is associated with. It’s not specified if this can be
   * a URL, relative path name, or just a base name. As such it has a mostly informal character.
   *
   * @type {string}
   */
  file = "";

  /**
   * An optional source root, useful for relocating source files on a server or removing repeated values in the
   * "sources" field. This value is prepended to the individual entries in the "sources" field.
   *
   * @type {string|undefined}
   */
  sourceRoot;

  /**
   * A list of original sources used by the "mappings" field. Each entry is either a string that is a
   * (potentially relative) URL or null if the source name is not known.
   *
   * @type {string[]}
   */
  sources = [];

  /**
   * An optional list of source content, useful when the original source can’t be hosted. The contents are listed in
   * the same order as the "sources" field. `null` may be used if some original sources should be retrieved by name.
   *
   * @type {string[]|undefined}
   */
  sourcesContent;

  /**
   * A list of symbol names used by the mappings entry.
   *
   * @type {string[]}
   */
  names = [];

  /**
   * A string with the encoded mapping data.
   *
   * @type {string}
   */
  mappings = "";

  /**
   * Identifies third-party sources (such as framework code or bundler-generated code), allowing developers to avoid
   * code that they don't want to see or step through, without having to configure this beforehand.
   *
   * The `x_google_ignoreList` field refers to the `sources` array, and lists the indices of all the known third-party
   * sources in that source map. When parsing the source map, developer tools can use this to determine sections of
   * the code that the browser loads and runs that could be automatically ignore-listed.
   *
   * @type {number[]|undefined}
   * @see https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.mt2g20loc2ct Source Map Revision 3 Proposal
   */
  x_google_ignoreList;

  /**
   * Convert this instance to a JSON stringified object.
   *
   * @return {string}
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * Convert this instance to a JSON data url containing the base64 encoded result of a call to `toString`.
   *
   * @return {string}
   */
  toUrl() {
    return 'data:application/json;charset=utf-8;base64,' + btoa(this.toString());
  }
}

module.exports = SourceMap;
//# sourceMappingURL=SourceMap.cjs.map
