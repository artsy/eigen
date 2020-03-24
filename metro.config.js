const { FileStore } = require("metro-cache")

module.exports = {
  cacheStores: [new FileStore({ root: "./.metro" })],
}
