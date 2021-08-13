import AsyncStorage from "@react-native-community/async-storage"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import { withSafeAreaProvider } from "./decorators"
import "./rn-addons"
import { loadStories } from "./storyLoader"

configure(() => {
  loadStories()
}, module)

addDecorator(withSafeAreaProvider)

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: AsyncStorage,
})

export default StorybookUIRoot
