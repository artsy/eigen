import { color } from "@artsy/palette-tokens"
import { goBack, navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { getCurrentEmissionState, useEnvironment, useFeatureFlag } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef, useState } from "react"
import { View } from "react-native"
import WebView from "react-native-webview"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"
import InternalWebView from "./InternalWebView"

export const ArtsyWebView: React.FC<{
  url: string
  showFullScreen?: boolean
  isPresentedModally?: boolean
  title?: string
}> = ({ url, showFullScreen, title, isPresentedModally }) => {
  const useReactNativeWebView = useFeatureFlag("AROptionsUseReactNativeWebView")

  const paddingTop = useScreenDimensions().safeAreaInsets.top
  const userAgent = getCurrentEmissionState().userAgent

  const ref = useRef<WebView>(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [loadProgress, setLoadProgress] = useState<number | null>(null)
  const webURL = useEnvironment().webURL
  const uri = url.startsWith("/") ? webURL + url : url

  if (useReactNativeWebView) {
    return (
      <View style={{ flex: 1, paddingTop }}>
        <FancyModalHeader
          useXButton={isPresentedModally && !canGoBack}
          onLeftButtonPress={() => {
            if (!canGoBack) {
              goBack()
            } else {
              ref.current?.goBack()
            }
          }}
        >
          {title}
        </FancyModalHeader>
        <View style={{ flex: 1 }}>
          <WebView
            ref={ref}
            source={{ uri }}
            style={{ flex: 1 }}
            userAgent={userAgent}
            onLoadStart={() => setLoadProgress(0.02)}
            onLoadEnd={() => setLoadProgress(null)}
            onLoadProgress={(e) =>
              setLoadProgress(e.nativeEvent.progress === 1 ? null : Math.max(e.nativeEvent.progress, 0.02))
            }
            onShouldStartLoadWithRequest={(ev) => {
              const result = matchRoute(ev.url)
              if (
                // open safari for external (non-artsy) URLs
                result.type === "external_url" ||
                // open native views in the app
                (result.module !== "ReactWebView" && result.module !== "WebView")
              ) {
                navigate(ev.url)
                return false
              }
              // otherwise navigate to other web view urls in the same web view
              return true
            }}
            onNavigationStateChange={(ev) => {
              setCanGoBack(ev.canGoBack)
            }}
          />
          {loadProgress !== null && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: loadProgress * 100 + "%",
                height: 2,
                backgroundColor: color("purple100"),
              }}
            ></View>
          )}
        </View>
      </View>
    )
  } else {
    return <InternalWebView route={url} showFullScreen={showFullScreen ?? true} />
  }
}
