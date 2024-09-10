const path = require("path")
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config")
const { FileStore } = require("metro-cache")

const config = {
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
  },

  resolver: {
    resolverMainFields: ["sbmodern", "react-native", "browser", "main"], // needed for storybook
    extraNodeModules: {
      images: path.resolve(__dirname, "./images"), // Add this line for Metro to resolve 'images folder'
    },
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
