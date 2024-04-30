# `html( options?: ImporterOptions )`

A plugin to import HTML files as part of a Rollup build.

## Parameters

### options: `ImporterOptions` _optional_

By default, if no `options` are supplied, this plugin allows importing of `*.htm` and `*.html` files as a 
`string` or `HTMLTemplateElement`.

It does not support importing these extensions without declaring a variable. These side effect modules are ignored
by default, however if an `output` is specified, a file will be created using the basic `bundle` callback to
combine the modules.

Take a look at the `ImporterOptions` object for more information on the available options.

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin.

### Example: Basic

By default, if no `options` are supplied, all `*.htm` and `*.html` files are imported as inline JavaScript.

```javascript
// rollup.config.js - Allow importing of HTML files
import { html } from "@steveush/rollup-utils";
export default {
    // ... other options
    input: "src/index.js",
    output: {
        // ... other options
        dir: "lib/output"
    },
    plugins: [ html() ]
};
```

So if we perform a build with the following files from the input.

```javascript
// src/index.js
import html from "./template.html";

console.log( html ); // => "<div class="template">\n\t<span class="child">PLACEHOLDER</span>\n</div>"
```

```html
<!-- src/template.html -->
<div class="template">
    <span class="child">PLACEHOLDER</span>
</div>
```

The result would be something like the following in the output directory.

```javascript
// lib/output/index.js
const html = `<div class="template">
    <span class="child">PLACEHOLDER</span>
</div>`;
console.log( html );
```

### Example: Using import with type syntax

By default, this plugin imports supported files as a literal string, however it also supports the import with type syntax to allow
files to be imported directly as a `HTMLTemplateElement` object.

```javascript
// rollup.config.js - Allows importing of HTML files
import { html } from "@steveush/rollup-utils";
export default {
    // ... other options
    input: "src/index.js",
    output: {
        dir: "lib/output"
    },
    plugins: [ html() ]
};
```

So if we perform a build with the following files from the input.

```javascript
// src/index.js
import template from "./template.html" with { type: "template" };

document.body.append( template.cloneNode( true ) );
```

```html
<!-- src/template.html -->
<div class="template">
    <span class="child">PLACEHOLDER</span>
</div>
```

The result would be something like the following in the output directory.

```javascript
// lib/output/index.js
const template = document.createElement( "template" );
template.innerHTML = `<div class="template">
    <span class="child">PLACEHOLDER</span>
</div>`;

document.body.append( template.cloneNode( true ) );
```
