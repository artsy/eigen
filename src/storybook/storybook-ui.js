import AsyncStorage from "@react-native-async-storage/async-storage"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import { withSafeArea, withTheme } from "./decorators"
import "./rn-addons"
import { loadStories } from "./storyLoader"

configure(() => {
  loadStories()
}, module)

addDecorator(withTheme)
addDecorator(withSafeArea)

export const StorybookUIRoot = getStorybookUI({
  onDeviceUI: true,
  asyncStorage: AsyncStorage,
})
