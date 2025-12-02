// Mock for moti/interactions to reduce memory usage in tests
const { Pressable } = require("react-native")

module.exports = {
  __esModule: true,
  MotiPressable: Pressable,
}
