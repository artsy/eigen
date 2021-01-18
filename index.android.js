global.__TEST__ = false
require("react-native-gesture-handler")
require("react-native-screens").enableScreens()
import { AppRegistry } from 'react-native'
import {App} from './src/lib/AndroidApp'
AppRegistry.registerComponent("Artsy", () => App)
