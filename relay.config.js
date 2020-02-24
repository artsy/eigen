module.exports = {
  src: "./src",
  schema: "./data/schema.graphql",
  language: "typescript",
  artifactDirectory: "./src/__generated__",
  persistOutput: "./data/complete.queryMap.json",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  customScalars: {
    /**
     * TODO:
     *
     * In reality this could also be a string when the `format` argument is used, but that's currently not done in
     * Emission and currenty no support exists in relay-compiler to be able to deal with that.
     *
     * See https://github.com/facebook/relay/issues/2830
     */
    FormattedNumber: "Int",
  },
}
