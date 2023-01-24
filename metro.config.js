const { FileStore } = require("metro-cache")

module.exports = {
  // metro cache locally
  cacheStores: [new FileStore({ root: "./.cache/metro" })],

  // this is to avoid OOM errors in CI.
  maxWorkers: process.env.CI == "true" ? 0 : 4,

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true, // this is so `import React from "react"` is not needed.
        inlineRequires: true,
      },
    }),
    // When bundling for production, React Native will minify class names and function names.
    // This makes it not possible to use the class names and function names in error messages.
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  },

  resolver: {
    resolverMainFields: ["sbmodern", "react-native", "browser", "main"], // needed for storybook
  },
}
