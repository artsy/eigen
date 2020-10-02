import { getCurrentEmissionState, useIsStaging } from "lib/store/AppStore"
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

  const headersForURL = (url: string) => {
    const { authenticationToken, userAgent } = getCurrentEmissionState()
    const passedURL = new URL(url)
    if (artsyDomains.includes(passedURL.host)) {
      return {
        "X-ACCESS-TOKEN": authenticationToken,
        "User-Agent": userAgent,
      }
    }
  }

  // TODO: There is a bug on rn-webview that causes headers to not be passed on subsequent requests
  // The behavior we actually want is to intercept all requests and check if the domain is
  // an artsy domain and if so inject auth headers
  // See this issue: https://github.com/react-native-webview/react-native-webview/issues/4#issuecomment-427671845
  // See this PR: https://github.com/react-native-webview/react-native-webview/pull/181/files
  const updatedURL = updateURL(initialURL)
  return <WebView source={{ uri: updatedURL, headers: headersForURL(updatedURL) }} />
}
