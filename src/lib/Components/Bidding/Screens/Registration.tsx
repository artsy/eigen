import React from "react"
import { NativeModules, NavigatorIOS, View, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import stripe from "tipsi-stripe"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Flex } from "../Elements/Flex"
import { Serif14, SerifSemibold18 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { BidInfoRow } from "../Components/BidInfoRow"
import { Button } from "../Components/Button"
import { Checkbox } from "../Components/Checkbox"
import { Container } from "../Components/Containers"
import { Divider } from "../Components/Divider"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

import { BillingAddress } from "./BillingAddress"
import { CreditCardForm } from "./CreditCardForm"

import { Registration_sale } from "__generated__/Registration_sale.graphql"

const Emission = NativeModules.Emission || {}

stripe.setOptions({ publishableKey: Emission.stripePublishableKey })

export interface RegistrationProps extends ViewProperties {
  sale: Registration_sale
  relay?: RelayPaginationProp
  navigator?: NavigatorIOS
}

interface RegistrationState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  state = {
    billingAddress: null,
    creditCardToken: null,
    creditCardFormParams: null,
    conditionsOfSaleChecked: false,
    isLoading: false,
  }

  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  showCreditCardForm() {
    this.props.navigator.push({
      component: CreditCardForm,
      title: "",
      passProps: {
        onSubmit: this.onCreditCardAdded,
        navigator: this.props.navigator,
      },
    })
  }

  showBillingAddressForm() {
    this.props.navigator.push({
      component: BillingAddress,
      title: "",
      passProps: {
        onSubmit: this.onBillingAddressAdded,
        billingAddress: this.state.billingAddress,
        navigator: this.props.navigator,
      },
    })
  }

  onCreditCardAdded = async (params: PaymentCardTextFieldParams) => {
    const token = await stripe.createTokenWithCard(params)
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded = (values: Address) => {
    this.setState({ billingAddress: values })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  render() {
    const { live_start_at, end_at } = this.props.sale
    const { billingAddress, creditCardToken: token } = this.state

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Flex alignItems="center">
            <Title mb={3}>Register to bid</Title>
            <Timer liveStartsAt={live_start_at} endsAt={end_at} />
            <SerifSemibold18 mt={5} mb={5}>
              {this.props.sale.name}
            </SerifSemibold18>

            <Divider mb={2} />

            <BidInfoRow
              label="Credit Card"
              value={token && this.formatCard(token)}
              onPress={() => this.showCreditCardForm()}
            />

            <Divider mb={2} />

            <BidInfoRow
              label="Billing address"
              value={billingAddress && this.formatAddress(billingAddress)}
              onPress={() => this.showBillingAddressForm()}
            />

            <Divider />
          </Flex>

          <View>
            <Checkbox justifyContent="center" onPress={() => this.conditionsOfSalePressed()}>
              <Serif14 mt={2} color="black60">
                Agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
              </Serif14>
            </Checkbox>

            <Flex m={4}>
              <Button
                text="Complete Registration"
                inProgress={this.state.isLoading}
                selected={this.state.isLoading}
                onPress={() => null}
              />
            </Flex>
          </View>
        </Container>
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

const LinkText = styled.Text`
  text-decoration-line: underline;
`

export const RegistrationScreen = createFragmentContainer(
  Registration,
  graphql`
    fragment Registration_sale on Sale {
      id
      end_at
      live_start_at
      name
      start_at
    }
  `
)
