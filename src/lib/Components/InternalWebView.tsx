import React from "react"
import { requireNativeComponent, View } from "react-native"

interface Props {
  route: string
  showFullScreen?: boolean
}

/**
 * Wrapper component around native web view, should be replaced with
 * react-native-webview
 */
export default class InternalWebView extends React.Component<Props, any> {
  render() {
    return <NativeInternalWebView style={{ flex: 1 }} {...this.props} />
  }
}

const NativeInternalWebView = requireNativeComponent("ARInternalWebView") as typeof View
