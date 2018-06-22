import React from "react"
import { NavigatorIOS, View } from "react-native"

import { BillingAddress } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { FlexProps } from "../Elements/Flex"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

interface PaymentInfoProps extends FlexProps {
  navigator?: NavigatorIOS
}

interface PaymentInfoState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
}

export class PaymentInfo extends React.Component<PaymentInfoProps, PaymentInfoState> {
  constructor(props) {
    super(props)

    this.state = { billingAddress: null, creditCardFormParams: null, creditCardToken: null }
  }

  presentCreditCardForm() {
    this.props.navigator.push({
      component: CreditCardForm,
      title: "",
      passProps: {
        onSubmit: (token, params) => this.onCreditCardAdded(token, params),
        params: this.state.creditCardFormParams,
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
        billingAddress: this.state.billingAddress,
        navigator: this.props.navigator,
      },
    })
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded(values: Address) {
    this.setState({ billingAddress: values })
  }

  render() {
    const { billingAddress, creditCardToken: token } = this.state

    return (
      <View>
        <Divider mb={2} />
        <BidInfoRow
          label="Credit Card"
          value={token && this.formatCard(token)}
          onPress={() => this.presentCreditCardForm()}
        />
        <Divider mb={2} />
        <BidInfoRow
          label="Billing address"
          value={billingAddress && this.formatAddress(billingAddress)}
          onPress={() => this.presentBillingAddressForm()}
        />
        <Divider mb={2} />
      </View>
    )
  }

  private formatCard(token: StripeToken) {
    return `${token.card.brand} •••• ${token.card.last4}`
  }

  private formatAddress(address: Address) {
    return [address.addressLine1, address.addressLine2, address.city, address.state].filter(el => el).join(" ")
  }
}
