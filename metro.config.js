const { FileStore } = require("metro-cache")

module.exports = {
  // metro cache locally
  cacheStores: [new FileStore({ root: "./.metro" })],

  // this is to avoid OOM errors in CI.
  maxWorkers: process.env.CI == "true" ? 0 : 4,

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true, // this is so `import React from "react"` is not needed.
        inlineRequires: true,
      },
    }),
  },

  resolver: {
    resolverMainFields: ["sbmodern", "react-native", "browser", "main"], // needed for storybook
  },
}
