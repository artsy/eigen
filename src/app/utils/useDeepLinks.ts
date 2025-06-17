import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { fetchMarketingURL } from "app/utils/fetchMarketingURL"
import { isMarketingURL } from "app/utils/isMarketingURL"
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
    if (!isNavigationReady) {
      return
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })
  }, [isNavigationReady])

  useEffect(() => {
    if (!isNavigationReady) {
      return
    }

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
    if (isMarketingURL(url)) {
      targetURL = await fetchMarketingURL(url)
    }

    const deepLinkUrl = targetURL ?? url

    // We track the deep link opened event
    trackEvent(tracks.deepLink(deepLinkUrl))

    // If the state is hydrated and the user is logged in
    // We navigate them to the the deep link
    if (isHydrated && isLoggedIn && isNavigationReady) {
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
