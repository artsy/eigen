import React from "react"
import { WebView, WebViewIOSLoadRequestEvent } from "react-native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

export class ZeroState extends React.Component<null> {
  shouldLoadRequest(e: WebViewIOSLoadRequestEvent) {
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
