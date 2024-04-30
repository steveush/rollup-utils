# `clean( paths?: string[] ): Plugin`

A [plugin](https://rollupjs.org/plugin-development/#plugins-overview) to clean paths as part of a Rollup build.

## Parameters

### paths: `string[]` _optional_

By default, if no `paths` are supplied, the `output.dir` or the `output.file` [configuration options](https://rollupjs.org/configuration-options/)
are used in the [renderStart](https://rollupjs.org/plugin-development/#renderstart) hook to automatically find the path to clean as this is
the earliest the [output options](https://rollupjs.org/javascript-api/#outputoptions-object) object is made available to hooks.

If the `paths` are supplied, the [output options](https://rollupjs.org/javascript-api/#outputoptions-object) are no longer needed so the 
clean is performed in the earlier [buildStart](https://rollupjs.org/plugin-development/#buildstart) hook.

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin.

### Example: `output.dir`

By default, when no `paths` are supplied, a configuration with an `output.dir` will have that directory deleted in the `renderStart` hook.

```js
// rollup.config.js - Deletes the "lib/output" directory.
import { clean } from "@steveush/rollup-utils";
export default {
    // ... other options
    output: {
        dir: "lib/output"
    },
    plugins: [ clean() ]
};
```

### Example: `output.file`

By default, when no `paths` are supplied, a configuration with an `output.file` will have that files parent directory deleted in the `renderStart` hook.

```js
// rollup.config.js - Deletes the "lib/output" directory
import { clean } from "@steveush/rollup-utils";
export default {
    // ... other options
    output: {
        file: "lib/output/index.js"
    },
    plugins: [ clean() ]
};
```

### Example: `paths`

Supplying the `paths` parameter results in the output options being ignored and only the specified paths being deleted in the `buildStart` hook.

```js
// rollup.config.js - Deletes the "lib/output/child" directory and "lib/output/some-file.js" file.
import { clean } from "@steveush/rollup-utils";
export default {
    // ... other options
    output: {
        dir: "lib/output"
    },
    plugins: [
        clean( [ "lib/output/child", "lib/output/some-file.js" ] )
    ]
};
```
