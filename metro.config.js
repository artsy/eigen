const { FileStore } = require("metro-cache")

module.exports = {
  // metro cache locally
  cacheStores: [new FileStore({ root: "./.metro" })],

  // this is to avoid OOM errors in CI.
  maxWorkers: process.env.CI == "true" ? 0 : 4,
}
