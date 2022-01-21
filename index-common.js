global.__TEST__ = false
global.__STORYBOOK__ = false

let newIosAppShell = false
let startStorybook = false

require("./src/lib/ignoreLogs")

if (__DEV__) {
  try {
    const fileContent = require("./metaflags.json")
    newIosAppShell = fileContent.newIosAppShell
    startStorybook = fileContent.startStorybook
  } catch {}
}

if (startStorybook) {
  console.log("aaaa")
  global.__STORYBOOK__ = true
  require("./src/storybook")
}

const { Platform } = require("react-native")

if (Platform.OS === "ios" && !newIosAppShell) {
  // old ios
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  require("./src/lib/ErrorReporting").setupSentry()
  require("./src/lib/AppRegistry")
}

if (Platform.OS === "android" || newIosAppShell) {
  const appName = newIosAppShell ? require("./app.json").appName : "Artsy"
  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  if (!newIosAppShell) {
    require("./src/lib/utils/PushNotification").configure()
  }
  const { AppRegistry } = require("react-native")
  const { App } = require("./src/lib/AndroidApp")
  AppRegistry.registerComponent(appName, () => App)
}
