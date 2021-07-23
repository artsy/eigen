import { withKnobs } from "@storybook/addon-knobs"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import "./rn-addons"
import { loadStories } from "./storyLoader"

// enables knobs for all stories
addDecorator(withKnobs)

// import stories
configure(() => {
  loadStories()
}, module)

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  onDeviceUI: false,
  asyncStorage: null,
})

export default StorybookUIRoot
