import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "app/navigation/navigate"
import { useEnvironment } from "app/store/GlobalStore"
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
        <ArtsyWebView url={webCheckoutUrl} />
      </View>
    </ArtsyKeyboardAvoidingView>
  )
}
