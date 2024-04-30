# `copy( source: string, target: string, patterns?: string[] ): Plugin`

A plugin to copy files from one directory to another as part of a Rollup build.

This uses the [writeBundle](https://rollupjs.org/plugin-development/#writebundle) hook to copy files matching the
[globby patterns](https://github.com/sindresorhus/globby?tab=readme-ov-file#globbypatterns-options) from one directory to another.

## Parameters

### source: `string` _required_

The source directory to copy files from.

### target: `string` _required_

The target directory to copy files to.

### patterns: `string[]` _optional_

A string array of [globby patterns](https://github.com/sindresorhus/globby?tab=readme-ov-file#globbypatterns-options) used 
to match the files to copy. Defaults to all files `[ "**/*" ]`.

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin.

### Example: Basic

By default, if no `patterns` are supplied, all files are copied from the `source` to the `target` directory.

```js
// rollup.config.js - Copies all files from "source/dir" to "target/dir"
import { copy } from "@steveush/rollup-utils";
export default {
    // ... other options
    plugins: [ copy( "source/dir", "target/dir" ) ]
};
```

### Example: `patterns`

Supplying the `patterns` option results in only those files that match the patterns being copied.

```js
// rollup.config.js - Copies all markdown files from "source/dir" to "target/dir"
import { copy } from "@steveush/rollup-utils";
export default {
    // ... other options
    plugins: [
        copy( "source/dir", "target/dir", [ "**/*.md" ] )
    ]
};
```
