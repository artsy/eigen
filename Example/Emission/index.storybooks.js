import { AppRegistry } from "react-native"
import { getStorybookUI, configure } from "@storybook/react-native"

import { loadStories } from "../../storybook/storyLoader"

import { makeHot, tryUpdateSelf, callOnce, clearCacheFor, redraw } from "haul/hot"

// import your stories
configure(() => {
  loadStories()
}, module)

const StorybookUI = getStorybookUI({ port: 9001, host: "localhost" })
AppRegistry.registerComponent("Storybook", makeHot(() => StorybookUI, "Storybook"))

if (module.hot) {
  module.hot.accept(() => {})
  module.hot.accept("@storybook/react-native", () => {
    clearCacheFor(require.resolve("@storybook/react-native"))
    redraw(() => require("@storybook/react-native").getStorybookUI)
  })
}
