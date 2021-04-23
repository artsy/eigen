const { FileStore } = require("metro-cache")

module.exports = {
  cacheStores: [new FileStore({ root: "./.metro" })],
  maxWorkers: process.env.CI == "true" ? 0 : 4,
}
