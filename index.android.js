global.__TEST__ = false
global.__STORYBOOK__ = false

// for more info about metaflags, look [here](/docs/metaflags.md)
let metaflags = {
  startStorybook: false,
}
if (__DEV__) {
  try {
    const fileContents = require("./metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch {}
}

const RNBootSplash = require("react-native-bootsplash")
RNBootSplash.hide()

require("./src/app/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (metaflags.startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  require("./src/app/utils/PushNotification").configure()
  const { AppRegistry } = require("react-native")
  const { App } = require("./src/app/AndroidApp")
  AppRegistry.registerComponent("Artsy", () => App)
}
