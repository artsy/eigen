const isProduction = process.env.NODE_ENV !== "development"

const persistConfig = {
  file: "./data/complete.queryMap.json",
  algorithm: "MD5",
}

module.exports = {
  src: "./src",
  schema: "./data/schema.graphql",
  language: "typescript",
  artifactDirectory: "./src/__generated__",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  ...(isProduction ? { persistConfig } : {}),
}
