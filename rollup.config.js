import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";

import { clean, copy } from "./src/index.js";

const isProduction = process.env.BUILD === "production";

export default [ {
    input: "src/index.js",
    output: {
        dir: "lib/es",
        format: "es",
        entryFileNames: "[name].js",
        generatedCode: "es2015",
        sourcemap: true,
        preserveModules: true
    },
    external: [ /node_modules/ ],
    plugins: [
        clean( [ "lib/es", "types" ] ),
        nodeResolve(),
        babel( {
            presets: [ [ "@babel/preset-env", { "modules": false } ] ],
            plugins: [ [ "@babel/plugin-transform-runtime", { "useESModules": true } ] ],
            babelHelpers: "runtime"
        } ),
        isProduction && terser( { keep_classnames: true } ),
        copy( "src", "types", [ "**/*.d.ts" ] )
    ]
}, {
    input: "src/index.js",
    output: {
        dir: "lib/cjs",
        format: "cjs",
        entryFileNames: "[name].cjs",
        generatedCode: "es2015",
        sourcemap: true,
        preserveModules: true
    },
    external: [ /node_modules/ ],
    plugins: [
        clean(),
        nodeResolve(),
        babel( {
            presets: [ "@babel/preset-env" ],
            plugins: [ "@babel/plugin-transform-runtime" ],
            babelHelpers: "runtime"
        } ),
        isProduction && terser( { keep_classnames: true } )
    ]
} ];