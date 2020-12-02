import { useEmissionOption } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import WebView from "react-native-webview"
import InternalWebView from "./InternalWebView"

export const ArtsyWebView: React.FC<{ url: string }> = ({ url }) => {
  const useReactNativeWebView = useEmissionOption("AROptionsUseReactNativeWebView")

  const paddingTop = useScreenDimensions().safeAreaInsets.top

  if (useReactNativeWebView) {
    return <WebView source={{ uri: url }} style={{ marginTop: paddingTop, flex: 1 }} />
  } else {
    return <InternalWebView route={url} />
  }
}
