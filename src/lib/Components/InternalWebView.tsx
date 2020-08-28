import React from "react"
import { requireNativeComponent } from "react-native"

interface Props {
  route: string
}

/**
 * Wrapper component around native web view, should be replaced with
 * react-native-webview
 */
export default class InternalWebView extends React.Component<Props, any> {
  render() {
    return <NativeInternalWebView {...this.props} />
  }
}

const NativeInternalWebView = requireNativeComponent("ARInternalWebView")
