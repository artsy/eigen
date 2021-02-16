import { useFeatureFlag } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import WebView from "react-native-webview"
import InternalWebView from "./InternalWebView"

export const ArtsyWebView: React.FC<{ url: string; showFullScreen?: boolean }> = ({ url, showFullScreen }) => {
  const useReactNativeWebView = useFeatureFlag("AROptionsUseReactNativeWebView")

  const paddingTop = useScreenDimensions().safeAreaInsets.top

  if (useReactNativeWebView) {
    return <WebView source={{ uri: url }} style={{ marginTop: paddingTop, flex: 1 }} />
  } else {
    return <InternalWebView route={url} showFullScreen={showFullScreen ?? true} />
  }
}
