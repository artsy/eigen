import { captureMessage } from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useEffect, useRef } from "react"
import { Linking } from "react-native"
import { useTracking } from "react-tracking"

export function useDeepLinks() {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)

  const launchURL = useRef<string | null>(null)

  const { trackEvent } = useTracking()

  useEffect(() => {
    captureMessage("NAV DEBUG: first useEffect", "debug")
    if (!isNavigationReady) {
      captureMessage("NAV DEBUG: first useEffect navigation NOT Ready", "debug")
      return
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        captureMessage(
          "NAV DEBUG: first useEffect navigation Ready with url handleDeeplink",
          "debug"
        )
        handleDeepLink(url)
      }
    })
  }, [isNavigationReady])

  useEffect(() => {
    captureMessage("NAV DEBUG: second useEffect", "debug")
    if (!isNavigationReady) {
      captureMessage("NAV DEBUG: second useEffect navigation NOT Ready", "debug")
      return
    }

    captureMessage("NAV DEBUG: second useEffect navigation Ready SUBSCRIPTION Added", "debug")
    const subscription = Linking.addListener("url", ({ url }) => {
      handleDeepLink(url)
    })

    return () => {
      subscription.remove()
    }
  }, [isHydrated, isLoggedIn, isNavigationReady])

  const handleDeepLink = async (url: string) => {
    let targetURL

    // If the url is a marketing or email-link url, we need to fetch the redirect
    if (url.includes("click.artsy.net") || url.includes("email-link.artsy.net")) {
      try {
        targetURL = await fetch(url)
      } catch (error) {
        if (__DEV__) {
          console.warn(
            `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${error}`
          )
        } else {
          captureMessage(
            `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${error}`,
            "error"
          )
        }
      }
    }

    const deepLinkUrl = targetURL?.url ?? url

    // We track the deep link opened event
    trackEvent(tracks.deepLink(deepLinkUrl))

    captureMessage(
      `NAV DEBUG Before CHECK ${isHydrated ? "Hydrated" : "Not Hydrated"} and ${
        isLoggedIn ? "Logged In" : "Not Logged In"
      } isNavigationReady: ${isNavigationReady}`,
      "debug"
    )

    // If the state is hydrated and the user is logged in
    // We navigate them to the the deep link
    if (isHydrated && isLoggedIn && isNavigationReady) {
      captureMessage(
        `NAV DEBUG ${isHydrated ? "Hydrated" : "Not Hydrated"} and ${
          isLoggedIn ? "Logged In" : "Not Logged In"
        } isNavigationReady: ${isNavigationReady}`,
        "debug"
      )
      // and we track the deep link
      navigate(deepLinkUrl)
      return
    }

    // Otherwise, we save the deep link url
    // to redirect them to the login screen once they log in
    launchURL.current = deepLinkUrl
  }

  useEffect(() => {
    if (isLoggedIn && launchURL.current && isNavigationReady) {
      // Navigate to the saved launch url
      navigate(launchURL.current)
      // Reset the launchURL
      launchURL.current = null
    }
  }, [isLoggedIn, isHydrated, launchURL.current, isNavigationReady])
}

const tracks = {
  deepLink: (url: string) => ({
    name: "Deep link opened",
    link: url,
    referrer: "unknown",
  }),
}
