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

if (startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  require("react-native-screens").enableScreens()
  require("./src/lib/utils/PushNotification").configure()
  const { AppRegistry } = require("react-native")
  const { gestureHandlerRootHOC } = require("react-native-gesture-handler")
  // const { App } = require("./src/lib/AndroidApp")
  const { HomeQueryRenderer } = require("./src/lib/Scenes/Home/Home")
  AppRegistry.registerComponent("Artsy", () => gestureHandlerRootHOC(HomeQueryRenderer))
}
