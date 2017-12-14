import React from "react"
import { WebView } from "react-native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

export class ZeroState extends React.Component<null> {
  render() {
    return (
      <WebView
        onShouldStartLoadWithRequest={e => {
          if (e.navigationType === "click") {
            SwitchBoard.presentNavigationViewController(this, e.url)
            return false
          }
          return true
        }}
        source={require("./index.html")}
        style={{ flex: 1 }}
      />
    )
  }
}
