const { Platform } = require("react-native")

global.__TEST__ = false

// start storybook depending on content of storybook.json
let startStorybook = false

try {
  const fileContent = require("./storybook.json")
  startStorybook = fileContent.startStorybook
} catch {}

if (startStorybook) {
  console.log("Starting storybook...")
  require("./src/storybook")
} else {
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()

  if (Platform.OS === "ios") {
    require("./src/lib/ErrorReporting")
    require("./src/lib/AppRegistry")
  } else if (Platform.OS === "android") {
    require("./src/lib/utils/PushNotification").configure()
    const { AppRegistry } = require("react-native")
    const { App } = require("./src/lib/AndroidApp")
    AppRegistry.registerComponent("Artsy", () => App)
  }
}
