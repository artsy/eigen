import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"

import { BillingAddress } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { bullet } from "palette"
import { FlexProps } from "../Elements/Flex"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

interface PaymentInfoProps extends FlexProps {
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

  presentBillingAddressForm() {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.navigator.push({
      component: BillingAddress,
      title: "",
      passProps: {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onSubmit: (address) => this.onBillingAddressAdded(address),
        billingAddress: this.props.billingAddress,
        navigator: this.props.navigator,
      },
    })
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
          onPress={() => {
            this.presentBillingAddressForm()
          }}
        />

        <Divider />
      </View>
    )
  }

  private formatCard(token: StripeToken) {
    return `${token.card.brand} ${bullet}${bullet}${bullet}${bullet} ${token.card.last4}`
  }

  private formatAddress(address: Address) {
    return [address.addressLine1, address.addressLine2, address.city, address.state]
      .filter((el) => el)
      .join(" ")
  }
}
