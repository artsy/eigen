import AsyncStorage from "@react-native-community/async-storage"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import "./rn-addons"
import { loadStories } from "./storyLoader"

// import stories
configure(() => {
  loadStories()
}, module)

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: AsyncStorage,
})

export default StorybookUIRoot
