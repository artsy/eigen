import { AppRegistry, Platform } from "react-native"
import RNBootSplash from "react-native-bootsplash"

import { StorybookUIRoot } from "./StorybookUI"

if (Platform.OS === "android") {
  RNBootSplash.hide()
}

const appName = Platform.OS === "ios" ? require("../../app.json").appName : "Artsy"
AppRegistry.registerComponent(appName, () => StorybookUIRoot)
