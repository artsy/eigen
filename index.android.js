global.__TEST__ = false
require("react-native-gesture-handler")
const { AppRegistry } = require('react-native')

const {App} = require('./src/lib/AndroidApp')
AppRegistry.registerComponent("Artsy", () => App)
