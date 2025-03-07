import path from "node:path"
import { fileURLToPath } from "node:url"
import * as Repack from "@callstack/repack"
import { babelModuleResolverAlias as moduleResolverAlias } from "./alias"

const babelPlugins = [
  "@babel/plugin-transform-named-capturing-groups-regex",
  "@babel/plugin-transform-flow-strip-types",
  ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
  ["@babel/plugin-transform-private-methods", { loose: true }], // needed for latest jest, must come after decorators
  ["@babel/plugin-transform-class-properties", { loose: true }], // must come after decorators
  ["@babel/plugin-proposal-class-static-block"], // Ensures static blocks work
  [
    "transform-imports",
    {
      lodash: {
        transform: "lodash/${member}",
        preventFullImport: true,
      },
    },
  ],
  "import-graphql", // to enable import syntax for .graphql and .gql files.
  "relay",

  ["module-resolver", { alias: moduleResolverAlias }],
  "react-native-reanimated/plugin", // has to be listed last according to the documentation. https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
]

const babelPresets = [
  [
    "module:@react-native/babel-preset",
    { useTransformReactJSXExperimental: true }, // this is so `import React from "react"` is not needed.
  ],
  // TODO: Remove this once we determine if its actually needed. Added during reanimated upgrade.
  // but then we determined that it was leading to errors with loading reanimated while remotely
  // debugging JS in chrome.
  // ["@babel/preset-env", { loose: true }],
  "@babel/preset-typescript",
  ["@babel/preset-react", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default {
  context: __dirname,
  entry: "./index-common.js",
  resolve: {
    ...Repack.getResolveOptions(),
    alias: {
      app: path.resolve(__dirname, "src/app"),
      images: path.resolve(__dirname, "images"),
    },
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Force Babel instead of SWC
          options: {
            presets: babelPresets,
            plugins: babelPlugins,
          },
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [new Repack.RepackPlugin()],
}
