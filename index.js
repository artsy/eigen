global.__TEST__ = false

// for more info about metaflags, look [here](/docs/metaflags.md)
let metaflags = {}

if (__DEV__) {
  const {
    mockSyncFunctionsWhenDebugging,
  } = require("./src/app/system/devTools/mockSyncFunctionsWhenDebugging")

  // Ensure we don't break the debugger
  mockSyncFunctionsWhenDebugging()

  try {
    const fileContents = require("./metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch {
    // ignore error
  }
}

import "react-native-url-polyfill/auto"
const { AppRegistry, Platform } = require("react-native")

const appName = require("./app.json").appName
require("react-native-gesture-handler")
const { App } = require("./src/app/App")

if (Platform.OS === "android") {
  require("./src/app/utils/PushNotification").configure()
}

AppRegistry.registerComponent(appName, () => App)
