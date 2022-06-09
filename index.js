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

if (Platform.OS == "android") {
  require("./src/app/utils/PushNotification").configure()
}

require("./src/app/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (metaflags.startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  const appName = require("./app.json").appName
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  const { AppRegistry, Platform } = require("react-native")
  const { App } = require("./src/app/App")
  AppRegistry.registerComponent(appName, () => App)
}
