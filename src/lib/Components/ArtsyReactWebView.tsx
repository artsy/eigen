import { color } from "@artsy/palette-tokens"
import { addBreadcrumb } from "@sentry/react-native"
import { goBack } from "lib/navigation/navigate"
import { getCurrentEmissionState, GlobalStore, useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useRef, useState } from "react"
import { Platform, View } from "react-native"
import WebView from "react-native-webview"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

export interface ArtsyWebViewConfig {
  title?: string
}

export const ArtsyReactWebViewPage: React.FC<
  {
    url: string
    isPresentedModally?: boolean
  } & ArtsyWebViewConfig
> = ({ url, title, isPresentedModally }) => {
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  return (
    <View style={{ flex: 1, paddingTop }}>
      <FancyModalHeader useXButton={isPresentedModally} onLeftButtonPress={goBack}>
        {title}
      </FancyModalHeader>
      <ArtsyReactWebView url={url} />
    </View>
  )
}

export const ArtsyReactWebView: React.FC<{
  url: string
}> = ({ url }) => {
  const userAgent = getCurrentEmissionState().userAgent

  const ref = useRef<WebView>(null)
  const [loadProgress, setLoadProgress] = useState<number | null>(null)
  const webURL = useEnvironment().webURL
  const uri = url.startsWith("/") ? webURL + url : url

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={ref}
        source={{ uri }}
        style={{ flex: 1 }}
        userAgent={userAgent}
        onLoadStart={() => setLoadProgress((p) => Math.max(0.02, p ?? 0))}
        onLoadEnd={() => setLoadProgress(null)}
        onLoadProgress={(e) => setLoadProgress(e.nativeEvent.progress)}
      />
      <ProgressBar loadProgress={loadProgress} />
    </View>
  )
}

const ProgressBar: React.FC<{ loadProgress: number | null }> = ({ loadProgress }) => {
  if (loadProgress === null) {
    return null
  }
  const progressPercent = Math.max(loadProgress * 100, 2)
  return (
    <View
      testID="progress-bar"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: progressPercent + "%",
        height: 2,
        backgroundColor: color("purple100"),
      }}
    />
  )
}

// tslint:disable-next-line:variable-name
export const __webViewTestUtils__ = __TEST__
  ? {
      ProgressBar,
    }
  : null

export function useWebViewCookies() {
  const authenticationToken = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" ? store.native.sessionState.authenticationToken : store.auth.userAccessToken
  )
  const webURL = useEnvironment().webURL
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    if (authenticationToken) {
      // sign in to force (this gives us force cookies in our web views)
      addBreadcrumb({ message: "Setting up artsy web view cookies" })
      async function attemptCookieSetup() {
        // Tried to do this with clearTimeout when the component unmounts, but it didn't work in jest :thinking_face:
        if (!isMounted.current) {
          return
        }
        try {
          const res = await fetch(webURL, {
            method: "HEAD",
            headers: { "X-Access-Token": authenticationToken! },
          })

          if (res.status > 400) {
            throw new Error("couldn't authenticate")
          }
          addBreadcrumb({ message: "Successfully set up artsy web view cookies" })
        } catch (e) {
          addBreadcrumb({ message: "Retrying to set up artsy web view cookies in 20 seconds" })
          setTimeout(attemptCookieSetup, 20 * 1000)
        }
      }
      attemptCookieSetup()
    }
    return () => {
      isMounted.current = false
    }
  }, [authenticationToken, webURL])
}
