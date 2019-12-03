import React from "react"
import { WebView } from "react-native-webview"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

export class ZeroState extends React.Component {
  shouldLoadRequest(e) {
    if (e.navigationType === "click") {
      SwitchBoard.presentNavigationViewController(this, e.url)
      return false
    }
    return true
  }

  render() {
    return (
      <WebView
        onShouldStartLoadWithRequest={this.shouldLoadRequest}
        source={require("./index.html")}
        style={{ flex: 1 }}
      />
    )
  }
}
