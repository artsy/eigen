import { useIsFocused } from "@react-navigation/native"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { fetchMarketingURL } from "app/utils/fetchMarketingURL"
import { isMarketingURL } from "app/utils/isMarketingURL"
import { useEffect, useState } from "react"
import { Linking } from "react-native"

/**
 * This is a hook that returns whether or not the user came from a deep link
 * (defined as a direct navigation to a route other than "/").
 *
 * This can be used to avoid rendering content in previous screens in react-navigation history
 *
 * @returns {isDeepLink: boolean | null}` isDeepLink` is true if the user came from a deep link. Initially, it is set to `null` while retrieving the deep link URL asynchronously and will be set to `false` if retrieving the `URL` fails.
 */
export const useIsDeepLink = () => {
  const [isDeepLink, setIsDeepLink] = useState<boolean | null>(null)

  const isFocused = useIsFocused()

  useEffect(() => {
    // When the user comes back from a deep link,
    // we want to show content again
    if (isFocused && isDeepLink === true) {
      setIsDeepLink(false)
    }
  }, [isFocused])

  useEffect(() => {
    Linking.getInitialURL()
      .then(async (url) => {
        if (!url) {
          setIsDeepLink(false)
          return
        }

        let targetURL: string | null = url

        // If the url is a marketing or email-link url, we need to fetch the redirect
        if (isMarketingURL(url)) {
          targetURL = (await fetchMarketingURL(url)) ?? "/"
        }

        const result = matchRoute(targetURL)
        const isExternalUrl = result.type === "external_url"
        const isHomeLink = result.type === "match" && result.module === "Home"
        const shouldTreatAsDeepLink = !isHomeLink && !isExternalUrl

        setIsDeepLink(shouldTreatAsDeepLink)
      })
      .catch((error) => {
        console.error("Error getting initial URL", error)
        setIsDeepLink(false)
      })
  }, [])

  return {
    isDeepLink,
  }
}
