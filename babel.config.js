module.exports = function(api) {
  api.cache.forever()
  return {
    plugins: [
      /**
       * Currently Flow generates non-spec compliant code and so we need to make sure to strip any Flow type annotations
       * /before/ running any of the other spec transforms that we’ve added.
       *
       * You may think “but golly, doesn’t the RN preset already include the plugin that strips Flow type annotations?”
       * and you wouldn’t be wrong; however, Babel runs plugins specified in one’s config /before/ presets and thus too
       * late.
       *
       * @see:
       * - https://babeljs.io/docs/en/plugins#plugin-ordering
       * - https://github.com/facebook/react-native/issues/20588#issuecomment-411798625
       * - https://github.com/babel/babel/issues/8417#issuecomment-430007587
       * - https://github.com/facebook/react-native/issues/20150#issuecomment-417858270
       */
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["relay", { artifactDirectory: "./src/__generated__" }],
    ],
    presets: ["module:metro-react-native-babel-preset", "@babel/preset-typescript"],
  }
}
