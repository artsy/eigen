import * as React from "react"
import { AppRegistry, NavigatorIOS } from "react-native"

import Browser from "./section_browser"

export interface Story {
  name: string
  render: () => any
}

export interface StorySection {
  kind: string
  stories: Story[]
}

const render = (props: any) => (
  <NavigatorIOS
    navigationBarHidden={true}
    initialRoute={{ component: Browser, title: "Welcome" }}
    style={{ flex: 1 }}
  />
)

export default class StorybookBrowser extends React.PureComponent<any, null> {
  render() {
    return render(this.props)
  }
}

AppRegistry.registerComponent("StorybookBrowser", () => StorybookBrowser)
