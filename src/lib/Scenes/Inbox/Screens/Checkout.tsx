import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "lib/navigation/navigate"
import { useEnvironment } from "lib/store/GlobalStore"
import React from "react"
import { View } from "react-native"

export const Checkout: React.FC<{ orderID: string; title: string }> = ({ orderID, title }) => {
  const webCheckoutUrl = `${useEnvironment().webURL}/orders/${orderID}`
  return (
    <ArtsyKeyboardAvoidingView>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <FancyModalHeader
          onLeftButtonPress={() => {
            dismissModal()
          }}
          leftButtonText="Cancel"
          rightButtonDisabled
          rightButtonText=" "
        >
          {title}
        </FancyModalHeader>
        <ArtsyWebView url={webCheckoutUrl} showFullScreen={false} />
      </View>
    </ArtsyKeyboardAvoidingView>
  )
}
