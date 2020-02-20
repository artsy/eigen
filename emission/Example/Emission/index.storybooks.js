import { AppRegistry } from "react-native"
import { getStorybookUI, configure, addDecorator } from "@storybook/react-native"
import React from "react"
import { Theme } from "@artsy/palette"
import { loadStories } from "../../storybook/storyLoader"

// import your stories
configure(() => {
  addDecorator(storyFn => <Theme>{storyFn()}</Theme>)
  loadStories()
}, module)

const StorybookUI = getStorybookUI({ port: 9001, host: "localhost" })
AppRegistry.registerComponent("Storybook", () => StorybookUI)
