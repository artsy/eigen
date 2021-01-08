import React from "react"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { StackScreenProps } from "@react-navigation/stack"
import { BidFlowStackProps } from "lib/Containers/BidFlow"
import { bullet } from "palette"
import NavigatorIOS from "react-native-navigator-ios"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { FlexProps } from "../Elements/Flex"
import { BillingAddressScreen } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

interface PaymentInfoProps extends FlexProps {
  navigation?: StackScreenProps<BidFlowStackProps, "ConfirmBidScreen">["navigation"]
  navigator?: NavigatorIOS
  onCreditCardAdded: (t: StripeToken, p: PaymentCardTextFieldParams) => void
  onBillingAddressAdded: (values: Address) => void
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
}

export class PaymentInfo extends React.Component<PaymentInfoProps> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)
  }

  presentCreditCardForm() {
    if (this.props.navigation) {
      this.props.navigation.navigate("CreditCardForm", {
        onSubmit: (token, params) => this.onCreditCardAdded(token, params),
        params: this.props.creditCardFormParams,
      })
      return
    }
    if (this.props.navigator) {
      this.props.navigator.push({
        component: CreditCardForm,
        title: "",
        passProps: {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onSubmit: (token, params) => this.onCreditCardAdded(token, params),
          params: this.props.creditCardFormParams,
          navigator: this.props.navigator,
        },
      })
    }
  }

  presentBillingAddressForm() {
    // TODO: Remove once we migration Registration.tsx to also use react-navigation
    if (this.props.navigator) {
      this.props.navigator.push({
        component: BillingAddressScreen,
        title: "",
        passProps: {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onSubmit: (address) => this.onBillingAddressAdded(address),
          billingAddress: this.props.billingAddress,
          navigator: this.props.navigator,
        },
      })
    }

    if (this.props.navigation) {
      this.props.navigation.navigate("BillingAddressScreen", {
        onSubmit: (address) => this.onBillingAddressAdded(address),
        billingAddress: this.props.billingAddress,
      })
    }
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.props.onCreditCardAdded(token, params)
  }

  onBillingAddressAdded(values: Address) {
    this.props.onBillingAddressAdded(values)
  }

  render() {
    const { billingAddress, creditCardToken: token } = this.props

    return (
      <BiddingThemeProvider>
        <View>
          <Divider />

          <BidInfoRow
            label="Credit card"
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            value={token && this.formatCard(token)}
            onPress={() => this.presentCreditCardForm()}
          />

          <Divider />

          <BidInfoRow
            label="Billing address"
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            value={billingAddress && this.formatAddress(billingAddress)}
            onPress={() => this.presentBillingAddressForm()}
          />

          <Divider />
        </View>
      </BiddingThemeProvider>
    )
  }

  private formatCard(token: StripeToken) {
    return `${token.card.brand} ${bullet}${bullet}${bullet}${bullet} ${token.card.last4}`
  }

  private formatAddress(address: Address) {
    return [address.addressLine1, address.addressLine2, address.city, address.state].filter((el) => el).join(" ")
  }
}
