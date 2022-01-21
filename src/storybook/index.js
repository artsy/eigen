import { AppRegistry, Platform } from "react-native"
import RNBootSplash from "react-native-bootsplash"

import { StorybookUIRoot } from "./storybook-ui"

if (Platform.OS === "android") {
  RNBootSplash.hide()
}

let newIosAppShell = false
if (__DEV__) {
  try {
    const fileContent = require("./metaflags.json")
    newIosAppShell = fileContent.newIosAppShell
  } catch {}
}

const appName = newIosAppShell && Platform.OS === "ios" ? require("../../app.json").appName : "Artsy"
AppRegistry.registerComponent(appName, () => StorybookUIRoot)
