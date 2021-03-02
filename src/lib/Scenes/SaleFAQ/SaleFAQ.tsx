import { useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import WebView from "react-native-webview"

export const SaleFAQ: React.FC<{}> = () => {
  const saleFAQUrl = `${useEnvironment().webURL}/auction-faq`
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  return <WebView source={{ uri: saleFAQUrl }} style={{ marginTop: paddingTop, flex: 1 }} />
}
