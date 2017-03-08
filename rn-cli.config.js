var blacklist = require("react-native/packager/blacklist")

var config = {
  getBlacklistRE(platform) {
    return blacklist(platform, [
      /coverage\/.*/
    ])
  },

  getSourceExts() {
    return ["js", "ts", "tsx"]
  },

  getTransformModulePath() {
    return require.resolve("./transformer")
  },
}

module.exports = config
