const moduleResolverAlias = require("./alias").babelModuleResolverAlias

module.exports = (api) => {
  api.cache.forever() // don't call this babel config all the time if it hasn't changed.

  return {
    // plugins run first
    plugins: [
      "@babel/plugin-transform-flow-strip-types",
      "import-graphql", // to enable import syntax for .graphql and .gql files.
      "relay",
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true, // this is only needed for `ProvideScreenTracking` that is deprecated. once we dont have that anymore, we can remove this. probably the whole plugin actually.
        },
      ],
      ["module-resolver", { alias: moduleResolverAlias }],
      "react-native-reanimated/plugin", // has to be listed last according to the documentation. https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
    ],

    // presets run after
    presets: [
      [
        "module:metro-react-native-babel-preset",
        { useTransformReactJSXExperimental: true }, // this is so `import React from "react"` is not needed.
      ],
      ["@babel/preset-env", { loose: true }],
      "@babel/preset-typescript",
      ["@babel/preset-react", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
    ],
  }
}
