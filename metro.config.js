const { FileStore } = require("metro-cache")

const defaultConfig = require("metro-config/src/defaults/").getDefaultValues(__dirname)

module.exports = {
  cacheStores: [new FileStore({ root: "./.metro" })],
  maxWorkers: process.env.CI == "true" ? 0 : 4,
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"]
  }
}
