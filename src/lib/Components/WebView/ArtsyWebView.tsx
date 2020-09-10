import { useIsStaging } from "lib/store/AppStore"
import React from "react"
import { WebView } from "react-native-webview"
import { URL } from "url"

interface Props {
  initialURL: string
}

export const ArtsyWebView: React.FC<Props> = ({ initialURL }) => {
  // TODO: these utilities probably belong somewhere else, David's new router object?
  // Also this is repeated logic from native code, consolidate if possible
  const baseWebURL = (isStaging: boolean) => {
    if (isStaging) {
      return new URL("https://staging.artsy.net")
    } else {
      return new URL("https://www.artsy.net")
    }
  }

  const artsyDomains = [
    "artsy.net",
    "www.artsy.net",
    "m.artsy.net",
    "api.artsy.net",
    "staging.artsy.net",
    "m-staging.artsy.net",
    "stagingapi.artsy.net",
  ]

  const updateURL = (url: string) => {
    const isStaging = useIsStaging()
    const expectedBaseURL = baseWebURL(isStaging)

    try {
      const passedURL = new URL(url)
      if (artsyDomains.includes(passedURL.host)) {
        if (expectedBaseURL.protocol !== passedURL.protocol) {
          passedURL.protocol = expectedBaseURL.protocol
        }
        if (expectedBaseURL.host !== passedURL.host) {
          passedURL.host = expectedBaseURL.host
        }
      }
      return passedURL.toString()
    } catch (_) {
      // Assume a relative url
      const resolvedURL = expectedBaseURL
      resolvedURL.pathname = url
      return resolvedURL.toString()
    }
  }

  return <WebView source={{ uri: updateURL(initialURL) }} />
}
