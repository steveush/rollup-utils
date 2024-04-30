# `css( options?: ImporterOptions )`

A plugin to import CSS, SASS or SCSS files as part of a Rollup build.

## Parameters

### options: `ImporterOptions` _optional_

By default, if no `options` are supplied, this plugin allows importing of `*.css`, `*.sass` and `*.scss` files as a 
`string`, `CSSStyleSheet` or `HTMLStyleElement`.

It also allows these extensions to be imported without declaring a variable. These side effect modules are bundled
together and output to a `*.css` file matching the current entry name.

Take a look at the `ImporterOptions` object for more information on the available options.

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin.

```javascript
// rollup.config.js - Allow importing of CSS, SASS and SCSS files
import { css } from "@steveush/rollup-utils";
export default {
    // ... other options
    plugins: [ css() ]
};
```

### Example: Basic

By default, if no `options` are supplied, all `*.css`, `*.sass` and `*.scss` files are either imported as inline 
JavaScript or bundled into a single `*.css` file.

```javascript
// rollup.config.js - Allow importing of CSS, SASS and SCSS files
import { css } from "@steveush/rollup-utils";
export default {
    // ... other options
    input: "src/index.js",
    output: {
        dir: "lib/output"
    },
    plugins: [ css() ]
};
```

So if we perform a build with the following files from the input.

```javascript
// src/index.js
import "./global.css";
import css from "./index.css";

console.log( css ); // => ".css{color: red}"
```

```css
/* src/index.css */
.css {
    color: red;
}
```

```css
/* src/global.css */
html {
    color: blue;
}
```

The result would be something like the following in the output directory.

```javascript
// lib/output/index.js
const css = `.css{color: red}`;
console.log( css );
```

```css
/* lib/output/index.css */
html{color: blue}
```

### Example: Using import with type syntax

By default, this plugin imports supported files as a literal string, however it also supports the import with type syntax to allow
files to be imported directly as a `CSSStyleSheet` or `HTMLStyleElement` objects.

```javascript
// rollup.config.js - Allows importing of CSS, SASS and SCSS files
import { css } from "@steveush/rollup-utils";
export default {
    // ... other options
    input: "src/index.js",
    output: {
        dir: "lib/output"
    },
    plugins: [ css() ]
};
```

So if we perform a build with the following files from the input.

```javascript
// src/index.js
import sheet from "./sheet.css" with { type: "css" };
import style from "./style.css" with { type: "style" };

document.adoptedStyleSheets.push( sheet );
document.head.append( style );
```

```css
/* src/sheet.css */
.css-sheet {
    color: red;
}
```

```css
/* src/style.css */
.css-style {
    color: blue;
}
```

The result would be something like the following in the output directory.

```javascript
// lib/output/index.js
const sheet = new CSSStyleSheet();
sheet.replaceSync( `.css-sheet{color: red}` );

const style = document.createElement( "style" );
style.textContent = `.css-style{color: blue}`;

document.adoptedStyleSheets.push( sheet );
document.head.append( style );
```
