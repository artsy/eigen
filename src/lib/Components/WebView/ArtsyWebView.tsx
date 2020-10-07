import { navigate } from "lib/navigation/navigate"
import { matchRoute } from "lib/navigation/routes"
import { getCurrentEmissionState, useIsStaging } from "lib/store/AppStore"
import React, { useState } from "react"
import { URL } from "react-native-url-polyfill"
import CustomWebView from "./CustomWebView"

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

  const updatedURL = updateURL(initialURL)
  const [currentURL, setURL] = useState(updatedURL)

  const artsyDomains = [
    "artsy.net",
    "www.artsy.net",
    "m.artsy.net",
    "api.artsy.net",
    "staging.artsy.net",
    "m-staging.artsy.net",
    "stagingapi.artsy.net",
  ]

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

  // A bit of a misnomer because we handle some routes by sending to a webview
  const nativeComponentExistsForURL = (url: string) => {
    return matchRoute(url).type === "match"
  }

  // TODO: There is a bug on rn-webview that causes headers to not be passed on subsequent requests
  // The behavior we actually want is to intercept all requests and check if the domain is
  // an artsy domain and if so inject auth headers
  // See this issue: https://github.com/react-native-webview/react-native-webview/issues/4#issuecomment-427671845
  // See this PR: https://github.com/react-native-webview/react-native-webview/pull/181/files

  return (
    <CustomWebView
      source={{ uri: updatedURL, headers: headersForURL(updatedURL) }}
      onShouldStartLoadWithRequest={(request) => {
        if (request.url === currentURL) {
          return true
        }
        // setURL(updateURL(request.url));
        // TODO: Handle sharing links
        // TODO: Handle follow / non-nav links
        // TODO: Send headers on subsequent requests
        // navigate to a native screen if possible
        if (nativeComponentExistsForURL(request.url)) {
          navigate(request.url)
          return false
          // @ts-ignore
        } else if (request.requestingNewWindow) {
          navigate(request.url)
          return false
        } else {
          // other url let the webview handle it
          return true
        }
      }}
    />
  )
}
