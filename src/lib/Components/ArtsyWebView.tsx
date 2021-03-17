import { color } from "@artsy/palette-tokens"
import { goBack, navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { getCurrentEmissionState, GlobalStore, useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import WebView from "react-native-webview"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

export interface ArtsyWebViewConfig {
  title?: string
  allowInPageNavigation?: boolean
  mimicBrowserBackButton?: boolean
}

export const ArtsyWebView: React.FC<
  {
    url: string
    isPresentedModally?: boolean
    title?: string
  } & ArtsyWebViewConfig
> = ({ url, title, isPresentedModally, allowInPageNavigation = true, mimicBrowserBackButton = true }) => {
  const paddingTop = useScreenDimensions().safeAreaInsets.top
  const userAgent = getCurrentEmissionState().userAgent

  const ref = useRef<WebView>(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [loadProgress, setLoadProgress] = useState<number | null>(null)
  const webURL = useEnvironment().webURL
  const uri = url.startsWith("/") ? webURL + url : url

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
          // This lets us use the native cookie storage
          // (also used by fetch, see useWebViewCookies)
          sharedCookiesEnabled
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
            if (!ev.isTopFrame) {
              return true
            }

            if (
              !allowInPageNavigation ||
              // open safari for external (non-artsy) URLs
              result.type === "external_url" ||
              // open native views in the app
              result.module !== "WebView"
            ) {
              navigate(ev.url)
              setLoadProgress(null)
              return false
            }
            console.log("web view navigate")
            // otherwise navigate to other web view urls in the same web view
            return true
          }}
          onNavigationStateChange={(ev) => {
            setCanGoBack(Boolean(mimicBrowserBackButton) && ev.canGoBack)
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
}

export function useWebViewCookies() {
  const authenticationToken = GlobalStore.useAppState(
    (store) => store.auth.userAccessToken ?? store.native.sessionState.authenticationToken
  )
  const webURL = useEnvironment().webURL
  useEffect(() => {
    if (authenticationToken) {
      // sign in to force (this gives us force cookies in our web views)
      fetch(webURL, {
        method: "HEAD",
        headers: { "X-Access-Token": authenticationToken },
      }).then((res) => {
        if (res.status >= 400) {
          console.error("couldn't sign in to force", res.status, res.statusText)
        }
      })
    }
  }, [authenticationToken, webURL])
}
