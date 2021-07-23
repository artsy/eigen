import { getStorybookUI } from "@storybook/react-native"

import "../../storybook.requires"

const StorybookUIRoot = getStorybookUI({
  onDeviceUI: false,
  asyncStorage: null,
})

export default StorybookUIRoot
