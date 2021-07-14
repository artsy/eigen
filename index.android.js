global.__TEST__ = false

// start storybook depending on content of storybook.json
let startStorybook = false

if (__DEV__) {
  try {
    const fileContent = require("./storybook.json")
    startStorybook = fileContent.startStorybook
  } catch {}
}

if (startStorybook) {
  require("./src/storybook")
} else {
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  require("./src/lib/utils/PushNotification").configure()
  const { AppRegistry } = require("react-native")
  const { App } = require("./src/lib/AndroidApp")
  AppRegistry.registerComponent("Artsy", () => App)
}
