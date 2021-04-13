const { FileStore } = require("metro-cache")

module.exports = {
  cacheStores: [new FileStore({ root: "./.metro" })],
  maxWorkers: process.env.CI == "true" ? 0 : 4,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
}
