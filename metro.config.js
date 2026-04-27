/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const path = require("path")
const { mergeConfig, getDefaultConfig } = require("@react-native/metro-config")
const { withRozeniteExpoAtlasPlugin } = require("@rozenite/expo-atlas-plugin")
const { withRozenite } = require("@rozenite/metro")
const { withSentryConfig } = require("@sentry/react-native/metro")
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
    resolverMainFields: ["react-native", "browser", "main"],
    extraNodeModules: {
      images: path.resolve(__dirname, "./images"), // Add this line for Metro to resolve 'images folder'
    },
  },
}

const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config)
const sentryConfig = withSentryConfig(mergedConfig)

module.exports = withRozenite(sentryConfig, {
  enhanceMetroConfig: (config) => withRozeniteExpoAtlasPlugin(config),
  enabled: process.env.WITH_ROZENITE === "true", // enable only in dev environment
})
