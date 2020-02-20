import React from "react"
import { AppRegistry } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import * as storybook from "@storybook/react-native"

import Browser from "./SectionBrowser"
import { storiesToTree } from "./utils"

export interface Story {
  name: string
  render: () => any
}

export interface StorySection {
  kind: string
  sections?: StorySection[]
  stories?: Story[]
}

const stories = storybook.getStorybook()
const root = storiesToTree(stories)

const render = (_props: any) => (
  <NavigatorIOS
    navigationBarHidden={true}
    initialRoute={{ component: Browser, title: "Welcome", passProps: { section: root } }}
    style={{ flex: 1 }}
  />
)

export default class StorybookBrowser extends React.Component<any, null> {
  render() {
    return render(this.props)
  }
}

AppRegistry.registerComponent("StorybookBrowser", () => StorybookBrowser)
