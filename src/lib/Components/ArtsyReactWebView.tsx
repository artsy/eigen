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
        // sharedCookiesEnabled is required on iOS for the user to be implicitly logged into force/prediction
        // on android it works without it
        sharedCookiesEnabled
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
  const accesstoken = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" ? store.native.sessionState.authenticationToken : store.auth.userAccessToken
  )
  const { webURL, predictionURL } = useEnvironment()
  useUrlCookies(webURL, accesstoken)
  useUrlCookies(predictionURL, accesstoken)
}

function useUrlCookies(url: string, accessToken: string | null) {
  useEffect(() => {
    if (accessToken) {
      const attempt = new CookieRequestAttempt(url, accessToken)
      attempt.makeAttempt()
      return () => {
        attempt.invalidated = true
      }
    }
  }, [accessToken, url])
}

class CookieRequestAttempt {
  invalidated = false
  constructor(public url: string, public accessToken: string) {}
  async makeAttempt() {
    if (this.invalidated) {
      return
    }
    try {
      const res = await fetch(this.url, {
        method: "HEAD",
        headers: { "X-Access-Token": this.accessToken! },
      })
      if (this.invalidated) {
        return
      }

      if (res.status > 400) {
        throw new Error("couldn't authenticate")
      }
      addBreadcrumb({ message: `Successfully set up artsy web view cookies for ${this.url}` })
    } catch (e) {
      if (this.invalidated) {
        return
      }
      addBreadcrumb({ message: `Retrying to set up artsy web view cookies in 20 seconds ${this.url}` })
      setTimeout(() => this.makeAttempt(), 1000 * 20)
    }
  }
}
