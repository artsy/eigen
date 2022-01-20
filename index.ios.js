global.__TEST__ = false
global.__STORYBOOK__ = false

let newIosAppShell = false
let startStorybook = false

require("./src/lib/ignoreLogs")

if (__DEV__) {
  try {
    const fileContent = require("./metaflags.json")
    startStorybook = fileContent.startStorybook
    newIosAppShell = fileContent.newIosAppShell
  } catch {}
}

if (newIosAppShell) {
  require("./App")
} else {
  if (startStorybook) {
    global.__STORYBOOK__ = true
    require("./src/storybook")
  } else {
    require("react-native-gesture-handler")
    require("react-native-screens").enableScreens()
    require("./src/lib/ErrorReporting").setupSentry()
    require("./src/lib/AppRegistry")
  }
}
