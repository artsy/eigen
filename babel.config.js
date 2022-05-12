const moduleResolverAlias = require("./alias").babelModuleResolverAlias

module.exports = (api) => {
  api.cache.forever() // don't call this babel config all the time if it hasn't changed.

  return {
    presets: [
      [
        "module:metro-react-native-babel-preset",
        {
          unstable_disableES6Transforms: true,
          useTransformReactJSXExperimental: true, // this is so `import React from "react"` is not needed.
        },
      ],
    ],
    plugins: [
      ["module-resolver", { alias: moduleResolverAlias }],
      /**
       * Currently Flow generates non-spec compliant code and so we need to make sure to strip any Flow type annotations
       * /before/ running any of the other spec transforms that we've added.
       *
       * You may think “but golly, doesn't the RN preset already include the plugin that strips Flow type annotations?”
       * and you wouldn't be wrong; however, Babel runs plugins specified in one's config /before/ presets and thus too
       * late.
       *
       * @see:
       * - https://babeljs.io/docs/en/plugins#plugin-ordering
       * - https://github.com/facebook/react-native/issues/20588#issuecomment-411798625
       * - https://github.com/babel/babel/issues/8417#issuecomment-430007587
       * - https://github.com/facebook/react-native/issues/20150#issuecomment-417858270
       */
      "@babel/plugin-transform-flow-strip-types",
      "@babel/plugin-transform-runtime",
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true, // this is only needed for `ProvideScreenTracking` that is deprecated. once we dont have that anymore, we can remove this. probably the whole plugin actually.
        },
      ],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
      ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }], // this is so `import React from "react"` is not needed.
      "relay",
      "import-graphql",
    ],
  }
}
