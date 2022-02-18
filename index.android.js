global.__TEST__ = false
global.__STORYBOOK__ = false

let metaflags = {
  startStorybook: false,
}
if (__DEV__) {
  try {
    const fileContents = require("./metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch {}
}

require("./src/lib/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (metaflags.startStorybook) {
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
