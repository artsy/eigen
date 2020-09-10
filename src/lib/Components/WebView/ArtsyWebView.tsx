import React from "react"
import { WebView } from "react-native-webview"

interface Props {
  uri: string
}

export const ArtsyWebView: React.FC<Props> = ({ uri }) => {
  return <WebView source={{ uri }} />
}
