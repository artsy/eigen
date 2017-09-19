import { AppRegistry } from "react-native"
import { getStorybookUI, configure } from "@storybook/react-native"

import { loadStories } from "../../storybook/storyLoader"

// import your stories
configure(() => {
  loadStories()
}, module)

const StorybookUI = getStorybookUI({ port: 9001, host: "localhost" })
AppRegistry.registerComponent("Storybook", () => StorybookUI)
