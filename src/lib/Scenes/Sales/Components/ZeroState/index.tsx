import { Sans, Separator, Theme } from "@artsy/palette"
import React from "react"
import { View } from "react-native"
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
      <Theme>
        <View style={{ flex: 1 }}>
          <Sans size="4" textAlign="center" mb={1} mt={2}>
            Auctions
          </Sans>
          <Separator />
          <WebView
            onShouldStartLoadWithRequest={this.shouldLoadRequest.bind(this)}
            source={require("./index.html")}
            style={{ flex: 1 }}
          />
        </View>
      </Theme>
    )
  }
}
