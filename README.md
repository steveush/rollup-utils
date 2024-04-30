# @steveush/rollup-utils

Rollup utility classes, methods and plugins for simple builds.

**NOTE**

Any version below 1.0.0 is considered experimental and is subject to change.

This package was created for my personal use, and so is provided as is.

## Plugins

* [clean( paths?: string[] )](src/plugins/clean/README.md) - Clean paths prior to building.
* [copy( source: string, target: string, patterns?: string[] )](src/plugins/copy/README.md) - Copy files from one directory to another after each build.
* [css( options?: ImporterOptions )](src/plugins/css/README.md) - Import CSS, SASS and SCSS files as a `string`, `CSSStyleSheet` or `HTMLStyleElement`.
* [html( options?: ImporterOptions )](src/plugins/html/README.md) - Import HTML files as a `string` or `HTMLTemplateElement`.

## Classes

* `Importer` - A utility class to help create Rollup plugins for importing and transforming text files.
* `SourceMap` - A version 3 source map implementation.

## Methods

<details>
<summary><code>getEntryInfo( ctx: PluginContext, moduleId: string ): ModuleInfo | null</code></summary>

Get the entry [ModuleInfo](https://rollupjs.org/plugin-development/#this-getmoduleinfo) for the given module id.

_**Params**_

* _**ctx:**_ `PluginContext`  
  The current Rollup [plugin context](https://rollupjs.org/plugin-development/#plugin-context).

* _**moduleId:**_ `string`  
  The module id to find the entry info for.

_**Returns**_

* `ModuleInfo`  
  If the entry was successfully found its [ModuleInfo](https://rollupjs.org/plugin-development/#this-getmoduleinfo) is returned.
* `null`  
  If the entry was not found `null` is returned.

</details>
<details>
<summary><code>getImportedIds( ctx: PluginContext, moduleId: string, addSelf?: boolean ): Readonly&lt;string&gt;</code></summary>

Recursively retrieve all imported module ids, in the order they were imported, for a given module.

_**Params**_

* _**ctx:**_ `PluginContext`  
  The current Rollup [plugin context](https://rollupjs.org/plugin-development/#plugin-context).

* _**moduleId:**_ `string`  
  The module id to retrieve all imported ids for.

* _**addSelf:**_ `boolean` _optional_  
  Whether to include the given _moduleId_ in the result.

_**Returns**_

* `Readonly<string>`  
  A readonly string array of imported module ids, in the order they were imported, for the given module.

</details>
<details>
<summary><code>isFilterPattern( value: any ): boolean</code></summary>

Check if a value is a Rollup filter pattern.

This does not accept `null` as a valid pattern, it checks if the value is a `string` or `RegExp` instance, or an array
of `string` or `RegExp` instances.

_**Params**_

* _**value:**_ `any`  
  The value to check.

_**Returns**_

* `boolean`  
  Returns `true` if the value is a filter pattern, otherwise `false`.

_**See**_

* [Rollup - createFilter](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter)

</details>
<details>
<summary><code>isSourceMapLike( value: any ): boolean</code></summary>

Check if a value is a Rollup filter pattern.

This does not accept `null` as a valid pattern, it checks if the value is a `string` or `RegExp` instance, or an array
of `string` or `RegExp` instances.

_**Params**_

* _**value:**_ `any`  
  The value to check.

_**Returns**_

* `boolean`  
  Returns `true` if the value is a filter pattern, otherwise `false`.

_**See**_

* [Rollup - createFilter](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter)

</details>

## Changelog

| Version | Description     |
|---------|-----------------|
| 0.0.1   | Initial release |