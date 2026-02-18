import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Text, useColor } from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { addBreadcrumb } from "@sentry/react-native"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { getCurrentEmissionState, GlobalStore } from "app/store/GlobalStore"
import {
  dismissModal,
  goBack,
  GoBackProps,
  // eslint-disable-next-line no-restricted-imports
  navigate,
  navigationEvents,
} from "app/system/navigation/navigate"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEnvironment } from "app/utils/hooks/useEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { useWebViewCallback } from "app/utils/useWebViewEvent"
import { debounce } from "lodash"
import { parse as parseQueryString } from "query-string"
import { forwardRef, LegacyRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Platform } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { Edge, useSafeAreaInsets } from "react-native-safe-area-context"
import Share from "react-native-share"
import { URL } from "react-native-url-polyfill"
import WebView, { WebViewNavigation, WebViewProps } from "react-native-webview"
import { useTracking } from "react-tracking"

export interface ArtsyWebViewConfig {
  title?: string
  /**
   * This makes the back button in the page control the web view's history.
   * Set this to false if you allow inner navigation but do not want the user
   * to be able to go 'back' within some flow, e.g. bnmo.
   */
  mimicBrowserBackButton?: boolean
  /**
   * Show the share URL button
   */
  showShareButton?: boolean
  /**
   * Show the X  button on the right side
   */
  useRightCloseButton?: boolean
  /**
   * Always present in a modal
   */
  alwaysPresentModally?: boolean
  /**
   * Always present in a modal
   */
  safeAreaEdges?: Array<Edge>
}

type WebViewWithShareTitleUrl = WebView & { shareTitleUrl: string }

export const ArtsyWebViewPage = ({
  url,
  title,
  isPresentedModally = false,
  mimicBrowserBackButton = true,
  useRightCloseButton = false,
  showShareButton = false,
  systemBackAction,
  backProps,
  backAction,
  safeAreaEdges,
}: {
  url: string
  isPresentedModally?: boolean
  backProps?: GoBackProps
  systemBackAction?: () => void
  backAction?: () => void
} & ArtsyWebViewConfig) => {
  const [canGoBack, setCanGoBack] = useState(false)
  const webURL = useEnvironment().webURL
  const ref = useRef<WebViewWithShareTitleUrl>(null)
  const tracking = useTracking()
  const { bottom } = useSafeAreaInsets()

  const handleArticleShare = async () => {
    const uri = url.startsWith("/") ? webURL + url : url
    /*
     * We only set shareTitleUrl if we navigate to a different URL within the same WebView
     */
    const shareUrl = ref.current?.shareTitleUrl || uri
    tracking.trackEvent(tracks.share(shareUrl))

    try {
      await Share.open({ url: shareUrl })
    } catch (error) {
      if (__DEV__) {
        console.log("ArtsyWebView.tsx", error)
      }
    }
  }

  const handleModalDismiss = () => {
    dismissModal()
  }

  useEffect(() => {
    const emitter = navigationEvents.addListener("requestModalDismiss", handleModalDismiss)

    return () => {
      emitter.removeListener("requestModalDismiss", handleModalDismiss)
    }
  }, [])

  const handleGoBack = () => {
    if (backAction) {
      backAction()
    } else {
      goBack(backProps)
    }
  }

  const onRightButtonPress = () => {
    if (showShareButton) {
      handleArticleShare()
    } else if (useRightCloseButton) {
      handleGoBack()
    }
  }

  const handleBackButtonPress = () => {
    if (isPresentedModally && !canGoBack) {
      dismissModal()
    } else if (!canGoBack) {
      handleGoBack()
    } else {
      if (systemBackAction) {
        systemBackAction()
      } else {
        ref.current?.goBack()
      }
    }
  }

  useBackHandler(() => {
    handleBackButtonPress()
    return true
  })

  const leftButton = useRightCloseButton && !canGoBack ? undefined : handleBackButtonPress

  return (
    <Screen>
      <Flex flex={1} backgroundColor="background">
        <KeyboardAvoidingView
          // Setting `behaviour` here breaks the avoidance on iOS, hence it's only set for Android
          behavior={Platform.select({ android: "padding" })}
          style={{ flex: 1, marginBottom: bottom }}
        >
          <NavigationHeader
            useXButton={!!isPresentedModally && !canGoBack}
            onLeftButtonPress={leftButton}
            useShareButton={showShareButton}
            rightCloseButton={useRightCloseButton}
            onRightButtonPress={
              showShareButton || useRightCloseButton ? onRightButtonPress : undefined
            }
          >
            {title}
          </NavigationHeader>
          <ArtsyWebView
            url={url}
            ref={ref}
            isPresentedModally={isPresentedModally}
            safeAreaEdges={safeAreaEdges}
            onNavigationStateChange={
              mimicBrowserBackButton
                ? (evt) => {
                    setCanGoBack(evt.canGoBack)
                  }
                : undefined
            }
          />
        </KeyboardAvoidingView>
      </Flex>
    </Screen>
  )
}

export const ArtsyWebView = forwardRef<
  WebViewWithShareTitleUrl,
  {
    url: string
    onNavigationStateChange?: WebViewProps["onNavigationStateChange"]
    isPresentedModally?: boolean
    safeAreaEdges?: Array<Edge>
  }
>(
  (
    { url, onNavigationStateChange: onNavigationStateChangeProp, isPresentedModally = false },
    ref
  ) => {
    const innerRef = useRef<WebViewWithShareTitleUrl>(null)
    const emissionUserAgent = getCurrentEmissionState().userAgent
    // adding the optional chaining to prevent the app from crashing on Android
    const userAgent = GlobalStore.useAppState((state) => state.native?.sessionState?.userAgent)
    useImperativeHandle(ref, () => innerRef.current as WebViewWithShareTitleUrl)
    const { callWebViewEventCallback } = useWebViewCallback()

    const enableDarkMode = useFeatureFlag("ARDarkModeSupport")
    const colorScheme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)
    const color = useColor()

    const showDevToggleIndicator = useDevToggle("DTShowWebviewIndicator")

    const webURL = useEnvironment().webURL
    const uri = url.startsWith("/") ? webURL + url : url
    // Track the initial path of this webview to avoid intercepting its own initial load
    const getInitialPath = () => {
      try {
        return new URL(uri).pathname
      } catch {
        return ""
      }
    }
    const initialPath = useRef<string>(getInitialPath())
    // Track if the webview has finished its initial load (including redirects)
    const hasFinishedInitialLoad = useRef(false)

    // Debounce calls just in case multiple stopLoading calls are made in a row
    const stopLoading = debounce((needToGoBack = true) => {
      innerRef.current?.stopLoading()

      if (needToGoBack) {
        innerRef.current?.goBack()
      }
    }, 500)

    const onNavigationStateChange = (evt: WebViewNavigation) => {
      // Helper to notify parent of navigation state changes when we allow navigation to complete
      const notifyParentOfNavigation = () => {
        onNavigationStateChangeProp?.(evt)
      }

      // Save the current state before we potentially update it
      const isStillInitialLoad = !hasFinishedInitialLoad.current

      // Mark initial load as complete when any page finishes loading
      if (isStillInitialLoad && !evt.loading) {
        hasFinishedInitialLoad.current = true
      }

      const targetURL = expandGoogleAdLink(evt.url)

      const result = matchRoute(targetURL)

      // TODO: need to implement the rest of native articles surfaces (news etc)
      // the purpose of this is to prevent the webview from redirecting you again
      // to the articles route, which would cause a loop and once in the webview to
      // redirect you to either a native article view or an article webview
      if (result.type === "match" && result.module === "Article") {
        notifyParentOfNavigation()
        return
      }
      if (result.type === "match" && result.module === "Feature") {
        notifyParentOfNavigation()
        return
      }

      // TODO: For not we are not redirecting to home from webviews because of artsy logo
      // in purchase flow breaking things. We should instead hide the artsy logo or not redirect to home
      // when in eigen purchase flow.
      if (result.type === "match" && result.module === "Home") {
        // Don't notify parent - we're canceling this navigation
        stopLoading(true)
        return
      }

      // if it's a route that we know we don't have a native view for, keep it in the webview
      // only vanityURLs which do not have a native screen ends up in the webview. So also keep in webview for VanityUrls
      // TODO:- Handle cases where a vanityURl lands in a webview and then webview url navigation state changes
      // to a different vanityURL that we can handle inapp, such as Fair & Partner.

      if (
        result.type === "match" &&
        ["ReactWebView", "VanityURLEntity", "LiveAuctionWebView"].includes(result.module)
      ) {
        if (innerRef.current) {
          innerRef.current.shareTitleUrl = targetURL
        }
        notifyParentOfNavigation()
        return
      } else if (result.type === "match" && result.module === "ModalWebView") {
        // For ModalWebView routes we want a separate modal to be presented to avoid
        // navigation issues with the original webview.
        const targetPath = new URL(targetURL).pathname

        // Don't intercept if this is the initial load or we're still in the initial load/redirect chain
        if (targetPath === initialPath.current || isStillInitialLoad) {
          notifyParentOfNavigation()
          return
        }

        // We're intercepting this navigation - don't notify parent
        // Stop loading and open a new modal webview
        innerRef.current?.stopLoading()

        navigate(targetURL)
        return
      } else {
        // Don't notify parent - we're canceling this navigation
        const needToGoBack =
          result.type !== "external_url" ||
          (result.type === "external_url" && Platform.OS === "android")
        stopLoading(needToGoBack)
      }

      // In case of a webview presented modally, if the targetURL is a tab View,
      // we need to dismiss the modal first to avoid having a tab rendered within the modal
      const modulePathName = new URL(targetURL).href?.split(/\/+/).filter(Boolean) ?? []

      const shouldDismissModal =
        isPresentedModally && result.type === "match" && modulePathName.length > 0

      // if it's an external url, or a route with a native view, use `navigate`
      if (!__TEST__) {
        innerRef.current?.stopLoading()
      }

      if (shouldDismissModal) {
        dismissModal(() => {
          // condition breaking the UI
          navigate(targetURL)
        })
      } else {
        navigate(targetURL)
      }
    }

    return (
      <Flex flex={1}>
        <WebView
          enableApplePay
          ref={innerRef as LegacyRef<WebView>}
          // sharedCookiesEnabled is required on iOS for the user to be implicitly logged into force/prediction
          // on android it works without it
          sharedCookiesEnabled
          decelerationRate="normal"
          source={{
            uri,
            headers: {
              ...(enableDarkMode && { "x-theme": colorScheme }),
              // Workaround for user agent breaking back behavior on Android
              // see: https://github.com/react-native-webview/react-native-webview/pull/3133
              ...(Platform.OS === "android" && { "User-Agent": emissionUserAgent }),
            },
          }}
          onHttpError={(error) => {
            const nativeEvent = error.nativeEvent
            if (nativeEvent.statusCode === 404) {
              Sentry.withScope((scope) => {
                scope.setExtra("route", nativeEvent.url)
                scope.setExtra("description", nativeEvent.description)
                Sentry.captureMessage("Navigation: WebView failed to load URL", "error")
              })
            }
          }}
          style={{ flex: 1, backgroundColor: color("mono0") }}
          userAgent={Platform.OS === "ios" ? userAgent : undefined}
          onMessage={({ nativeEvent }) => {
            const data = nativeEvent.data
            try {
              const jsonData = JSON.parse(data)
              callWebViewEventCallback(jsonData)
            } catch (e) {
              console.log("error parsing webview message data", e, data)
            }
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
        {!!showDevToggleIndicator && (
          <Flex
            position="absolute"
            top={50}
            left={-25}
            style={{ transform: [{ rotate: "90deg" }] }}
          >
            <Text color="red">webview</Text>
          </Flex>
        )}
      </Flex>
    )
  }
)

export function useWebViewCookies() {
  const accessToken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userID)
  const { webURL, predictionURL } = useEnvironment()
  useUrlCookies(webURL, accessToken, isLoggedIn)
  useUrlCookies(predictionURL + "/login", accessToken, isLoggedIn)
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
  constructor(
    public url: string,
    public accessToken: string
  ) {}
  async makeAttempt() {
    if (this.invalidated) {
      return
    }

    try {
      const res = await fetch(this.url, {
        method: "HEAD",
        headers: { "X-Access-Token": this.accessToken },
      })
      if (this.invalidated) {
        return
      }

      if (res.status > 400) {
        throw new Error("couldn't authenticate")
      }

      addBreadcrumb({ message: `Successfully set up artsy web view cookies for ${this.url}` })
    } catch (e) {
      const seconds = __TEST__ ? 1 : 20
      if (this.invalidated) {
        return
      }

      addBreadcrumb({
        message: `Retrying to set up artsy web view cookies in 20 seconds ${this.url}`,
      })
      setTimeout(() => this.makeAttempt(), 1000 * seconds)
    }
  }
}

function getAfterFirstQuestionMark(str: string) {
  const index = str.indexOf("?")
  if (index === -1) return "" // no question mark found
  return str.slice(index + 1)
}

function expandGoogleAdLink(url: string) {
  const expandGoogleAdLinkUrl = new URL(url)
  if (expandGoogleAdLinkUrl.href.includes("googleads.g.doubleclick.net")) {
    const queryString = getAfterFirstQuestionMark(expandGoogleAdLinkUrl.href)

    const adurl = parseQueryString(queryString ?? "").adurl as string | undefined
    if (adurl && new URL(adurl)) {
      return adurl
    }
  }
  return url
}

const tracks = {
  share: (slug: string) => ({
    action: Schema.ActionNames.Share,
    action_type: Schema.ActionTypes.Tap,
    context_screen_owner_type: OwnerType.articles,
    context_screen_owner_slug: slug,
  }),
}

export const _test_expandGoogleAdLink = expandGoogleAdLink
