global.__TEST__ = false
require("react-native-gesture-handler")
require("react-native-screens").enableScreens()
require("./src/lib/utils/PushNotification").configure()
const { AppRegistry } = require('react-native')

const {App} = require('./src/lib/AndroidApp')
AppRegistry.registerComponent("Artsy", () => App)
