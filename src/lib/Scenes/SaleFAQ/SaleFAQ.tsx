import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import { useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { View } from "react-native"

export const SaleFAQ: React.FC = () => {
  const saleFAQUrl = `${useEnvironment().webURL}/auction-faq`
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  return (
    <View style={{ flex: 1, paddingTop }}>
      <ArtsyWebView url={saleFAQUrl} />
    </View>
  )
}
