global.__TEST__ = false
global.__STORYBOOK__ = false

// for more info about metaflags, look [here](/docs/metaflags.md)
let metaflags = {
  newIosAppShell: false,
  startStorybook: false
}

if (__DEV__) {
  try {
    const fileContent = require("./metaflags.json")
    newIosAppShell = fileContent.newIosAppShell
    startStorybook = fileContent.startStorybook
  } catch {}
}

require("./src/app/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (metaflags.startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  const { Platform } = require("react-native")

  if (Platform.OS === "ios" && !newIosAppShell) {
    // old ios
    require("react-native-gesture-handler")
    require("react-native-screens").enableScreens()
    require("./src/app/AppRegistry")
  }

  if (Platform.OS === "android" || newIosAppShell) {
    const appName = (newIosAppShell && !(Platform.OS === "android")) ? require("./app.json").appName : "Artsy"
    // polyfills are required for react-tracking to work properly
    require("core-js/actual")
    require("react-native-gesture-handler")
    require("react-native-screens").enableScreens()
    if (!newIosAppShell) {
      require("./src/app/utils/PushNotification").configure()
    }
    const { AppRegistry } = require("react-native")
    const { App } = require("./src/app/AndroidApp")
    AppRegistry.registerComponent(appName, () => App)
  }
}


