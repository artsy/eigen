import { color } from "@artsy/palette-tokens"
import { addBreadcrumb } from "@sentry/react-native"
import { goBack, navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { getCurrentEmissionState, GlobalStore, useEnvironment, useFeatureFlag } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { parse as parseQueryString } from "query-string"
import React, { useEffect, useRef, useState } from "react"
import { Platform, View } from "react-native"
import WebView, { WebViewProps } from "react-native-webview"
import { parse as parseURL } from "url"
import { ArtsyKeyboardAvoidingView } from "./ArtsyKeyboardAvoidingView"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

export interface ArtsyWebViewConfig {
  title?: string
  /**
   * This makes the back button in the page control the web view's history.
   * Set this to false if you allow inner navigation but do not want the user
   * to be able to go 'back' within some flow, e.g. bnmo.
   */
  mimicBrowserBackButton?: boolean
  /**
   * Set this to false if you want all clicked links to be handled by our `navigate` method.
   */
  allowWebViewInnerNavigation?: boolean
}

export const ArtsyReactWebViewPage: React.FC<
  {
    url: string
    isPresentedModally?: boolean
  } & ArtsyWebViewConfig
> = ({ url, title, isPresentedModally, allowWebViewInnerNavigation = true, mimicBrowserBackButton = true }) => {
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  const [canGoBack, setCanGoBack] = useState(false)
  const ref = useRef<WebView>(null)

  return (
    <View style={{ flex: 1, paddingTop }}>
      <ArtsyKeyboardAvoidingView>
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
        <ArtsyReactWebView
          url={url}
          ref={ref}
          allowWebViewInnerNavigation={allowWebViewInnerNavigation}
          onNavigationStateChange={mimicBrowserBackButton ? (ev) => setCanGoBack(ev.canGoBack) : undefined}
        />
      </ArtsyKeyboardAvoidingView>
    </View>
  )
}

export const ArtsyReactWebView = React.forwardRef<
  WebView,
  {
    url: string
    allowWebViewInnerNavigation?: boolean
    onNavigationStateChange?: WebViewProps["onNavigationStateChange"]
  }
>(({ url, allowWebViewInnerNavigation = true, onNavigationStateChange }, ref) => {
  const userAgent = getCurrentEmissionState().userAgent

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
        decelerationRate="normal"
        source={{ uri }}
        style={{ flex: 1 }}
        userAgent={userAgent}
        onLoadStart={() => setLoadProgress((p) => Math.max(0.02, p ?? 0))}
        onLoadEnd={() => setLoadProgress(null)}
        onLoadProgress={(e) => {
          // we don't want to set load progress after navigating away from this
          // web view (in onShouldStartLoadWithRequest). So we set
          // loadProgress to null after navigating to another screen, and we
          // check for that case here.
          if (loadProgress !== null) {
            setLoadProgress(e.nativeEvent.progress)
          }
        }}
        onShouldStartLoadWithRequest={(ev) => {
          const targetURL = expandGoogleAdLink(ev.url)
          const result = matchRoute(targetURL)
          // On android onShouldStartLoadWithRequest is only called for actual navigation requests
          // On iOS it is also called for other-origin script/resource requests, so we use
          // isTopFrame to check that this request pertains to an actual navigation request
          const isTopFrame = Platform.OS === "android" ? true : ev.isTopFrame
          if (!isTopFrame || targetURL === uri) {
            // we use `|| targetURL === uri` because otherwise, if the URI points to a
            // page that can be handled natively, we'll jump directly out of a the web view.
            return true
          }

          // If the target URL points to another page that we can handle with a web view, let's go there
          if (allowWebViewInnerNavigation && result.type === "match" && result.module === "ReactWebView") {
            return true
          }

          // Otherwise use `navigate` to handle it like any other link in the app
          navigate(targetURL)
          setLoadProgress(null)
          return false
        }}
        onNavigationStateChange={onNavigationStateChange}
      />
      <ProgressBar loadProgress={loadProgress} />
    </View>
  )
})

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

export function useWebViewCookies() {
  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")
  const accesstoken = GlobalStore.useAppState((store) =>
    Platform.OS === "android" || showNewOnboarding
      ? store.auth.userAccessToken
      : store.native.sessionState.authenticationToken
  )
  const { webURL, predictionURL } = useEnvironment()
  useUrlCookies(webURL, accesstoken)
  useUrlCookies(predictionURL + "/login", accesstoken)
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

function expandGoogleAdLink(url: string) {
  const parsed = parseURL(url)
  if (parsed.host === "googleads.g.doubleclick.net") {
    const adurl = parseQueryString(parsed.query ?? "").adurl as string | undefined
    if (adurl && parseURL(adurl)) {
      return adurl
    }
  }
  return url
}

// tslint:disable-next-line:variable-name
export const __webViewTestUtils__ = __TEST__
  ? {
      ProgressBar,
      expandGoogleAdLink,
    }
  : null
