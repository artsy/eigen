import { OwnerType } from "@artsy/cohesion"
import { addBreadcrumb } from "@sentry/react-native"
import { dismissModal, goBack, GoBackProps, navigate } from "app/navigation/navigate"
import { matchRoute } from "app/navigation/routes"
import { BottomTabRoutes } from "app/Scenes/BottomTabs/bottomTabsConfig"
import {
  getCurrentEmissionState,
  GlobalStore,
  useDevToggle,
  useEnvironment,
} from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Text } from "palette"
import { parse as parseQueryString } from "query-string"
import React, { useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import Share from "react-native-share"
import WebView, { WebViewProps } from "react-native-webview"
import { useTracking } from "react-tracking"
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
  /**
   * Show the share URL button
   */
  showShareButton?: boolean
  /**
   * Show the X  button on the right side
   */
  useRightCloseButton?: boolean
}

type CustomWebView = WebView & { shareTitleUrl: string }

export const ArtsyReactWebViewPage: React.FC<
  {
    url: string
    isPresentedModally?: boolean
    backProps?: GoBackProps
  } & ArtsyWebViewConfig
> = ({
  url,
  title,
  isPresentedModally,
  allowWebViewInnerNavigation = true,
  mimicBrowserBackButton = true,
  useRightCloseButton = false,
  showShareButton,
  backProps,
}) => {
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  const [canGoBack, setCanGoBack] = useState(false)
  const webURL = useEnvironment().webURL
  const ref = useRef<CustomWebView>(null)

  const tracking = useTracking()
  const handleArticleShare = async () => {
    const uri = url.startsWith("/") ? webURL + url : url
    /*
     * We only set shareTitleUrl if we navigate to a different URL within the same WebView
     */
    const shareUrl = ref.current?.shareTitleUrl || uri
    tracking.trackEvent(tracks.share(shareUrl))
    try {
      await Share.open({
        url: shareUrl,
      })
    } catch (error) {
      if (__DEV__) {
        console.error("ArtsyReactWebView.tsx", error)
      }
    }
  }

  const handleGoBack = () => {
    goBack(backProps)
  }

  const onRightButtonPress = () => {
    if (showShareButton) {
      return handleArticleShare()
    } else if (useRightCloseButton) {
      return handleGoBack()
    }
  }

  return (
    <Flex flex={1} pt={paddingTop}>
      <ArtsyKeyboardAvoidingView>
        <FancyModalHeader
          rightCloseButton={useRightCloseButton}
          useXButton={isPresentedModally && !canGoBack}
          onLeftButtonPress={
            useRightCloseButton && !canGoBack
              ? undefined
              : () => {
                  if (isPresentedModally && !canGoBack) {
                    dismissModal()
                  } else if (!canGoBack) {
                    handleGoBack()
                  } else {
                    ref.current?.goBack()
                  }
                }
          }
          useShareButton={showShareButton}
          onRightButtonPress={
            showShareButton || useRightCloseButton ? onRightButtonPress : undefined
          }
        >
          {title}
        </FancyModalHeader>
        <ArtsyReactWebView
          url={url}
          ref={ref}
          allowWebViewInnerNavigation={allowWebViewInnerNavigation}
          isPresentedModally={isPresentedModally}
          onNavigationStateChange={
            mimicBrowserBackButton
              ? (ev) => {
                  setCanGoBack(ev.canGoBack)
                }
              : undefined
          }
        />
      </ArtsyKeyboardAvoidingView>
    </Flex>
  )
}

export const ArtsyReactWebView = React.forwardRef<
  CustomWebView,
  {
    url: string
    allowWebViewInnerNavigation?: boolean
    onNavigationStateChange?: WebViewProps["onNavigationStateChange"]
    isPresentedModally?: boolean
  }
>(
  (
    {
      url,
      allowWebViewInnerNavigation = true,
      onNavigationStateChange,
      isPresentedModally = false,
    },
    ref
  ) => {
    const userAgent = getCurrentEmissionState().userAgent

    const [loadProgress, setLoadProgress] = useState<number | null>(null)
    const showIndicator = useDevToggle("DTShowWebviewIndicator")

    const webURL = useEnvironment().webURL
    const uri = url.startsWith("/") ? webURL + url : url

    return (
      <Flex flex={1}>
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
            if (
              allowWebViewInnerNavigation &&
              result.type === "match" &&
              result.module === "ReactWebView"
            ) {
              if (ref) {
                ;(ref as any).current.shareTitleUrl = targetURL
              }
              return true
            }

            // In case of a webview presentaed modally, if the targetURL is a tab View,
            // we need to dismiss the modal first to avoid having a tab rendered within the modal
            const modulePathName = parseURL(targetURL).pathname?.split(/\/+/).filter(Boolean) ?? []
            if (
              isPresentedModally &&
              result.type === "match" &&
              modulePathName.length > 0 &&
              BottomTabRoutes.includes("/" + modulePathName[0])
            ) {
              dismissModal()
            }
            // Otherwise use `navigate` to handle it like any other link in the app
            navigate(targetURL)
            setLoadProgress(null)
            return false
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
        <ProgressBar loadProgress={loadProgress} />
        {showIndicator ? (
          <Flex
            position="absolute"
            top={50}
            left={-25}
            style={{ transform: [{ rotate: "90deg" }] }}
          >
            <Text color="red">webview</Text>
          </Flex>
        ) : null}
      </Flex>
    )
  }
)

const ProgressBar: React.FC<{ loadProgress: number | null }> = ({ loadProgress }) => {
  if (loadProgress === null) {
    return null
  }

  const progressPercent = Math.max(loadProgress * 100, 2)
  return (
    <Flex
      testID="progress-bar"
      position="absolute"
      top={0}
      left={0}
      width={progressPercent + "%"}
      height={2}
      backgroundColor="blue100"
    />
  )
}

export function useWebViewCookies() {
  const accesstoken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userID)
  const { webURL, predictionURL } = useEnvironment()
  useUrlCookies(webURL, accesstoken, isLoggedIn)
  useUrlCookies(predictionURL + "/login", accesstoken, isLoggedIn)
}

function useUrlCookies(url: string, accessToken: string | null, isLoggedIn: boolean) {
  useEffect(() => {
    if (accessToken && isLoggedIn) {
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
      addBreadcrumb({
        message: `Retrying to set up artsy web view cookies in 20 seconds ${this.url}`,
      })
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

const tracks = {
  share: (slug: string) => ({
    action: Schema.ActionNames.Share,
    action_type: Schema.ActionTypes.Tap,
    context_screen_owner_type: OwnerType.articles,
    context_screen_owner_slug: slug,
  }),
}
