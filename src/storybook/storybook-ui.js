import AsyncStorage from "@react-native-community/async-storage"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import { withSafeArea } from "./decorators"
import "./rn-addons"
import { loadStories } from "./storyLoader"

configure(() => {
  loadStories()
}, module)

addDecorator(withSafeArea)

export const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: AsyncStorage,
})
