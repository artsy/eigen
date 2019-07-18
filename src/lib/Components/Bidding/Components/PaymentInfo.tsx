import React from "react"
import { View } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { BillingAddress } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { Sans } from "@artsy/palette"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
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
  constructor(props) {
    super(props)
  }

  presentCreditCardForm() {
    this.props.navigator.push({
      component: CreditCardForm,
      title: "",
      passProps: {
        onSubmit: (token, params) => this.onCreditCardAdded(token, params),
        params: this.props.creditCardFormParams,
        navigator: this.props.navigator,
      },
    })
  }

  presentBillingAddressForm() {
    this.props.navigator.push({
      component: BillingAddress,
      title: "",
      passProps: {
        onSubmit: address => this.onBillingAddressAdded(address),
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
      <BiddingThemeProvider>
        <View>
          <Divider />

          <BidInfoRow
            label="Credit card"
            value={token && this.formatCard(token)}
            onPress={() => this.presentCreditCardForm()}
          />

          <Divider />

          <BidInfoRow
            label="Billing address"
            value={billingAddress && this.formatAddress(billingAddress)}
            onPress={() => this.presentBillingAddressForm()}
          />

          <Divider />

          <Sans mt="5" size="3t" color="black60" textAlign="center">
            A valid credit card is required for bidding.
          </Sans>
        </View>
      </BiddingThemeProvider>
    )
  }

  private formatCard(token: StripeToken) {
    return `${token.card.brand} •••• ${token.card.last4}`
  }

  private formatAddress(address: Address) {
    return [address.addressLine1, address.addressLine2, address.city, address.state].filter(el => el).join(" ")
  }
}
