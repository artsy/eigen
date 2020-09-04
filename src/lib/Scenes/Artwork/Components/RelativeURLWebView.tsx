import { Flex, Sans, Spinner } from "palette"
import React, { useState } from "react"
import { NativeModules } from "react-native"
import { WebView } from "react-native-webview"

interface WebViewProps {
  route: string
}

export const RelativeURLWebView: React.FC<WebViewProps> = ({ route }) => {
  const [urlResolution, setURLResolution] = useState<{ resolvedURL: string | null; failedToLoad: boolean }>({
    resolvedURL: null,
    failedToLoad: false,
  })

  NativeModules.ARTemporaryAPIModule.resolveRelativeURL(route)
    .then(resolvedURL => {
      setURLResolution({ resolvedURL, failedToLoad: false })
    })
    .catch(_ => {
      setURLResolution({ resolvedURL: null, failedToLoad: true })
    })

  if (urlResolution.resolvedURL) {
    return <WebView source={{ uri: urlResolution.resolvedURL }} />
  } else if (urlResolution.failedToLoad) {
    // TODO: Probably want to show 404 page rather than this
    return <Sans size="3t">Something went wrong</Sans>
  } else {
    // Loading
    return (
      <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }
}
