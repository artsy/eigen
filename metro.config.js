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
const { getSentryExpoConfig } = require("@sentry/react-native/metro")
const { FileStore } = require("metro-cache")

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname)

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
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    resolverMainFields: ["sbmodern", "react-native", "browser", "main"], // needed for storybook
    extraNodeModules: {
      images: path.resolve(__dirname, "./images"), // Add this line for Metro to resolve 'images folder'
    },
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
}

const mergedConfig = mergeConfig(getSentryExpoConfig(__dirname), config)

module.exports = withRozenite(mergedConfig, {
  enhanceMetroConfig: (config) => withRozeniteExpoAtlasPlugin(config),
})
