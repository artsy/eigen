import { AppRegistry } from "react-native"
import RNBootSplash from "react-native-bootsplash"

import StorybookUIRoot from "./storybook-ui"

RNBootSplash.hide()
AppRegistry.registerComponent("Artsy", () => StorybookUIRoot)
