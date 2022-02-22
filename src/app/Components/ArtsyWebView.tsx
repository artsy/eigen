import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { ArtsyReactWebView } from "./ArtsyReactWebView"
import InternalWebView from "./InternalWebView"

export const ArtsyWebView: React.FC<{ url: string; showFullScreen?: boolean }> = ({
  url,
  showFullScreen,
}) => {
  const useReactNativeWebView = useFeatureFlag("AROptionsUseReactNativeWebView")

  if (useReactNativeWebView) {
    return <ArtsyReactWebView url={url} />
  } else {
    return <InternalWebView route={url} showFullScreen={showFullScreen ?? true} />
  }
}
