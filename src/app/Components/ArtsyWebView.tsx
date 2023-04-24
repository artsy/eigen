import { OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { addBreadcrumb } from "@sentry/react-native"
import { BottomTabRoutes } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { matchRoute } from "app/routes"
import { getCurrentEmissionState, GlobalStore } from "app/store/GlobalStore"
import { dismissModal, goBack, GoBackProps, navigate } from "app/system/navigation/navigate"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEnvironment } from "app/utils/hooks/useEnvironment"
import { Schema } from "app/utils/track"
import { useWebViewCallback } from "app/utils/useWebViewEvent"
import { debounce } from "lodash"
import { parse as parseQueryString } from "query-string"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Share from "react-native-share"
import WebView, { WebViewProps } from "react-native-webview"
import { useTracking } from "react-tracking"
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
   * Show the share URL button
   */
  showShareButton?: boolean
  /**
   * Show the X  button on the right side
   */
  useRightCloseButton?: boolean
}

type WebViewWithShareTitleUrl = WebView & { shareTitleUrl: string }

export const ArtsyWebViewPage = ({
  url,
  title,
  isPresentedModally = false,
  mimicBrowserBackButton = true,
  useRightCloseButton = false,
  showShareButton = false,
  backProps,
  backAction,
}: {
  url: string
  isPresentedModally?: boolean
  backProps?: GoBackProps
  backAction?: () => void
} & ArtsyWebViewConfig) => {
  const saInsets = useSafeAreaInsets()

  const [canGoBack, setCanGoBack] = useState(false)
  const webURL = useEnvironment().webURL
  const ref = useRef<WebViewWithShareTitleUrl>(null)

  const tracking = useTracking()

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

  return (
    <Flex flex={1} pt={isPresentedModally ? 0 : `${saInsets.top}px`} backgroundColor="white">
      <ArtsyKeyboardAvoidingView>
        <FancyModalHeader
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
          rightCloseButton={useRightCloseButton}
          onRightButtonPress={
            showShareButton || useRightCloseButton ? onRightButtonPress : undefined
          }
        >
          {title}
        </FancyModalHeader>
        <ArtsyWebView
          url={url}
          ref={ref}
          isPresentedModally={isPresentedModally}
          onNavigationStateChange={
            mimicBrowserBackButton
              ? (evt) => {
                  setCanGoBack(evt.canGoBack)
                }
              : undefined
          }
        />
      </ArtsyKeyboardAvoidingView>
    </Flex>
  )
}

export const ArtsyWebView = forwardRef<
  WebViewWithShareTitleUrl,
  {
    url: string
    onNavigationStateChange?: WebViewProps["onNavigationStateChange"]
    isPresentedModally?: boolean
  }
>(({ url, onNavigationStateChange, isPresentedModally = false }, ref) => {
  const innerRef = useRef<WebViewWithShareTitleUrl>(null)
  useImperativeHandle(ref, () => innerRef.current!)
  const userAgent = getCurrentEmissionState().userAgent
  const { callWebViewEventCallback } = useWebViewCallback()

  const [loadProgress, setLoadProgress] = useState<number | null>(null)
  const showIndicator = useDevToggle("DTShowWebviewIndicator")

  const webURL = useEnvironment().webURL
  const uri = url.startsWith("/") ? webURL + url : url

  // Debounce calls just in case multiple stopLoading calls are made in a row
  const stopLoading = debounce(() => {
    innerRef.current?.stopLoading()
    innerRef.current?.goBack()
  }, 500)

  return (
    <Flex flex={1}>
      <WebView
        ref={innerRef}
        // sharedCookiesEnabled is required on iOS for the user to be implicitly logged into force/prediction
        // on android it works without it
        sharedCookiesEnabled
        decelerationRate="normal"
        source={{ uri }}
        style={{ flex: 1 }}
        userAgent={userAgent}
        onMessage={({ nativeEvent }) => {
          const data = nativeEvent.data
          try {
            const jsonData = JSON.parse(data)
            callWebViewEventCallback(jsonData)
          } catch (e) {
            console.log("error parsing webview message data", e, data)
          }
        }}
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
        onNavigationStateChange={(evt) => {
          onNavigationStateChange?.(evt)

          const targetURL = expandGoogleAdLink(evt.url)

          const result = matchRoute(targetURL)

          // if it's a route that we know we don't have a native view for, keep it in the webview
          // only vanityURLs which do not have a native screen ends up in the webview. So also keep in webview for VanityUrls
          // TODO:- Handle cases where a vanityURl lands in a webview and then webview url navigation state changes
          // to a different vanityURL that we can handle inapp, such as Fair & Partner.
          if (
            result.type === "match" &&
            (result.module === "ReactWebView" || result.module === "VanityURLEntity")
          ) {
            innerRef.current!.shareTitleUrl = targetURL
            return
          } else {
            stopLoading()
          }

          // In case of a webview presented modally, if the targetURL is a tab View,
          // we need to dismiss the modal first to avoid having a tab rendered within the modal
          const modulePathName = new URL(targetURL).pathname?.split(/\/+/).filter(Boolean) ?? []

          const shouldDismissModal =
            isPresentedModally &&
            result.type === "match" &&
            modulePathName.length > 0 &&
            BottomTabRoutes.includes("/" + modulePathName[0])

          // if it's an external url, or a route with a native view, use `navigate`
          if (!__TEST__) {
            innerRef.current?.stopLoading()
          }
          setLoadProgress(null)

          if (shouldDismissModal) {
            dismissModal(() => {
              // We need to navigate only after the modal has been dismissed to avoid a race
              // condition breaking the UI
              navigate(targetURL)
            })
          } else {
            navigate(targetURL)
          }
        }}
      />
      <ProgressBar loadProgress={loadProgress} />
      {showIndicator ? (
        <Flex position="absolute" top={50} left={-25} style={{ transform: [{ rotate: "90deg" }] }}>
          <Text color="red">webview</Text>
        </Flex>
      ) : null}
    </Flex>
  )
})

const ProgressBar = ({ loadProgress }: { loadProgress: number | null }) => {
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
  const parsed = new URL(url)
  if (parsed.host === "googleads.g.doubleclick.net") {
    const adurl = parseQueryString(parsed.search ?? "").adurl as string | undefined
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
