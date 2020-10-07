import React, { Component } from "react"
import { NativeModules, requireNativeComponent } from "react-native"
import { WebView, WebViewProps } from "react-native-webview"
const { ARArtsyWebViewManager } = NativeModules

export default class CustomWebView extends Component<WebViewProps> {
  render() {
    return (
      <WebView
        {...this.props}
        nativeConfig={{
          component: ARArtsyWebView as any,
          viewManager: ARArtsyWebViewManager,
        }}
      />
    )
  }
}

const ARArtsyWebView = requireNativeComponent("ARArtsyWebView")
