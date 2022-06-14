import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { useEnvironment } from "app/store/GlobalStore"
import React from "react"
import { View } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const SaleFAQ: React.FC<{}> = () => {
  const saleFAQUrl = `${useEnvironment().webURL}/auction-faq`
  const paddingTop = useScreenDimensions().safeAreaInsets.top

  return (
    <View style={{ flex: 1, paddingTop }}>
      <ArtsyWebView url={saleFAQUrl} />
    </View>
  )
}
