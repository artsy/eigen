import { AppRegistry, Platform } from "react-native"
import RNBootSplash from "react-native-bootsplash"

import { StorybookUIRoot } from "./StorybookUI"

if (Platform.OS === "android") {
  RNBootSplash.hide()
}

if (__DEV__) {
  try {
    const fileContent = require("./metaflags.json")
  } catch {}
}

const appName = Platform.OS === "ios" ? require("../../app.json").appName : "Artsy"
AppRegistry.registerComponent(appName, () => StorybookUIRoot)
