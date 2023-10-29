const moduleResolverAlias = require("./alias").babelModuleResolverAlias
const paletteExportMap = require("./scripts/palette/exportMap.json")

module.exports = (api) => {
  api.cache.forever() // don't call this babel config all the time if it hasn't changed.

  return {
    // plugins run first
    plugins: [
      "@babel/plugin-transform-named-capturing-groups-regex",
      "@babel/plugin-transform-flow-strip-types",
      ["@babel/plugin-proposal-decorators", { version: "legacy" }],
      ["@babel/plugin-proposal-private-methods", { loose: true }], // needed for latest jest, must come after decorators
      ["@babel/plugin-proposal-class-properties", { loose: true }], // must come after decorators
      [
        "transform-imports",
        {
          "@artsy/palette-mobile": {
            transform: (importName) => {
              const srcPath = paletteExportMap[importName]

              if (!srcPath) {
                throw new Error(`Cannot find a mapping for ${importName}. Check your exportMap.`)
              }

              // Convert the src path to the desired dist path
              const distPath = srcPath.replace("/src/", "/dist/").replace(/\.tsx?$/, "")

              return `@artsy/palette-mobile${distPath}`
            },
            preventFullImport: true,
            skipDefaultConversion: true,
          },
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
    ],

    // presets run after
    presets: [
      [
        "module:metro-react-native-babel-preset",
        { useTransformReactJSXExperimental: true }, // this is so `import React from "react"` is not needed.
      ],
      // TODO: Remove this once we determine if its actually needed. Added during reanimated upgrade.
      // but then we determined that it was leading to errors with loading reanimated while remotely
      // debugging JS in chrome.
      // ["@babel/preset-env", { loose: true }],
      "@babel/preset-typescript",
      ["@babel/preset-react", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
    ],
  }
}
