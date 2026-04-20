// Mock for Zeego's iOS dependency (react-native-ios-context-menu)
// This is a manual mock that Jest automatically uses when the module is imported
const { View } = require("react-native")

module.exports = {
  ContextMenuView: View,
  ContextMenuButton: View,
}
