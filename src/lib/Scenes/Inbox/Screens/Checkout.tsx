import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "lib/navigation/navigate"
import { useEnvironment } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { KeyboardAvoidingView, View } from "react-native"

export const Checkout: React.FC<{ orderID: string; title: string; inquiryCheckout?: boolean }> = ({
  orderID,
  title,
  inquiryCheckout = false,
}) => {
  console.warn({ inquiryCheckout })
  const webCheckoutUrl = `${useEnvironment().webURL}/orders/${orderID}`
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={useScreenDimensions().safeAreaInsets.top}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <FancyModalHeader
          onLeftButtonPress={() => {
            dismissModal()
          }}
          onRightButtonPress={() => {
            dismissModal()
          }}
          leftButtonText={inquiryCheckout ? " " : "Cancel"}
          rightButtonDisabled={!inquiryCheckout}
          rightButtonText={inquiryCheckout ? "Close" : " "}
        >
          {title}
        </FancyModalHeader>
        <ArtsyWebView url={webCheckoutUrl} showFullScreen={false} />
      </View>
    </KeyboardAvoidingView>
  )
}
