import { captureMessage } from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useEffect, useRef } from "react"
import { Linking } from "react-native"
import { useTracking } from "react-tracking"

export function useDeepLinks() {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const launchURL = useRef<string | null>(null)

  const { trackEvent } = useTracking()

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })
  }, [])

  useEffect(() => {
    Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url)
    })

    return () => {
      Linking.removeAllListeners("url")
    }
  }, [isHydrated, isLoggedIn])

  const handleDeepLink = async (url: string) => {
    let targetURL

    try {
      targetURL = await fetch(url)
    } catch (error) {
      if (__DEV__) {
        console.warn(error)
      } else {
        captureMessage(
          `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${error}`,
          "error"
        )
      }
    }

    const deepLinkUrl = targetURL?.url ?? url

    // track deep link tap
    trackEvent(tracks.deepLink(deepLinkUrl))

    // If the state is hydrated and the user is logged in
    // We navigate them to the the deep link
    if (isHydrated && isLoggedIn) {
      navigate(deepLinkUrl)
    }

    // Otherwise, we save the deep link url
    // to redirect them to the login screen once they log in
    launchURL.current = deepLinkUrl
  }

  useEffect(() => {
    if (isLoggedIn && launchURL.current) {
      // These will be redirected, avoided double tracking
      if (!launchURL.current.includes("click.artsy.net")) {
        trackEvent(tracks.deepLink(launchURL.current))
      }

      // Navigate to the saved launch url
      navigate(launchURL.current)
      // Reset the launchURL
      launchURL.current = null
    }
  }, [isLoggedIn, isHydrated, launchURL.current])
}

const tracks = {
  deepLink: (url: string) => ({
    name: "Deep link opened",
    link: url,
    referrer: "unknown",
  }),
}
