const typescript = require("relay-compiler-language-typescript")

module.exports = {
  src: "./src",
  schema: "./data/schema.graphql",
  // language: "typescript",
  language: typescript,
  artifactDirectory: "./src/__generated__",
  persistOutput: "./data/complete.queryMap.json",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
}
