global.__TEST__ = false
global.__STORYBOOK__ = false

// start storybook depending on content of storybook.json
let startStorybook = false

if (__DEV__) {
  try {
    const fileContent = require("./storybook.json")
    startStorybook = fileContent.startStorybook
  } catch {}
}

require("./src/lib/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  // polyfills are required for react-tracking to work properly
  require("core-js/actual")
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  require("./src/lib/utils/PushNotification").configure()
  const { AppRegistry } = require("react-native")
  const { App } = require("./src/lib/AndroidApp")
  AppRegistry.registerComponent("Artsy", () => App)
}
