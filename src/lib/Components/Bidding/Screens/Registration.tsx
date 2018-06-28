import React from "react"
import { NativeModules, NavigatorIOS, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import stripe from "tipsi-stripe"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Flex } from "../Elements/Flex"
import { Serif14, SerifSemibold18 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Checkbox } from "../Components/Checkbox"
import { Container } from "../Components/Containers"
import { PaymentInfo } from "../Components/PaymentInfo"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

import { Registration_me } from "__generated__/Registration_me.graphql"
import { Registration_sale } from "__generated__/Registration_sale.graphql"

const Emission = NativeModules.Emission || {}

stripe.setOptions({ publishableKey: Emission.stripePublishableKey })

export interface RegistrationProps extends ViewProperties {
  sale: Registration_sale
  me: Registration_me
  relay?: RelayPaginationProp
  navigator?: NavigatorIOS
}

interface RegistrationState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  requiresPaymentInformation: boolean
}

const creditCardMutation = graphql`
  mutation RegistrationCreateCreditCardMutation($input: CreditCardInput!) {
    createCreditCard(input: $input) {
      credit_card {
        id
        brand
        name
        last_digits
        expiration_month
        expiration_year
      }
    }
  }
`
const bidderMutation = graphql`
  mutation RegistrationCreateBidderMutation($input: CreateBidderInput!) {
    createBidder(input: $input) {
      bidder {
        id
        qualified_for_bidding
      }
    }
  }
`

export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  constructor(props) {
    super(props)

    const { has_credit_cards } = this.props.me
    const requiresPaymentInformation = !has_credit_cards

    this.state = {
      billingAddress: null,
      creditCardToken: null,
      creditCardFormParams: null,
      conditionsOfSaleChecked: false,
      requiresPaymentInformation,
      isLoading: false,
    }
  }

  canCreateBidder() {
    const { billingAddress, creditCardToken, conditionsOfSaleChecked } = this.state

    if (this.state.requiresPaymentInformation) {
      return billingAddress && creditCardToken && conditionsOfSaleChecked
    } else {
      return conditionsOfSaleChecked
    }
  }

  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded(values: Address) {
    this.setState({ billingAddress: values })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  register() {
    this.setState({ isLoading: true })

    this.state.requiresPaymentInformation ? this.createCreditCardAndBidder() : this.createBidder()
  }

  async createCreditCardAndBidder() {
    const { billingAddress, creditCardFormParams } = this.state
    const token = await stripe.createTokenWithCard({
      ...creditCardFormParams,
      name: billingAddress.fullName,
      addressLine1: billingAddress.addressLine1,
      addressLine2: billingAddress.addressLine2,
      addressCity: billingAddress.city,
      addressState: billingAddress.state,
      addressZip: billingAddress.postalCode,
    })

    commitMutation(this.props.relay.environment, {
      onCompleted: () => this.createBidder(),
      onError: () => {
        console.log("ERROR!")
      },
      mutation: creditCardMutation,
      variables: {
        input: {
          token: token.tokenId,
        },
      },
    })
  }

  createBidder() {
    commitMutation(this.props.relay.environment, {
      onCompleted: () => {
        console.log("COMPLETED!")
      },
      onError: () => {
        console.log("ERROR!")
      },
      mutation: bidderMutation,
      variables: { input: { sale_id: this.props.sale.id } },
    })
  }

  render() {
    const { live_start_at, end_at, is_preview, start_at } = this.props.sale

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <View>
            <Flex alignItems="center">
              <Title mb={3}>Register to bid</Title>
              <Timer liveStartsAt={live_start_at} endsAt={end_at} isPreview={is_preview} startsAt={start_at} />
              <SerifSemibold18 mt={5} mb={5}>
                {this.props.sale.name}
              </SerifSemibold18>
            </Flex>

            {this.state.requiresPaymentInformation && (
              <PaymentInfo
                navigator={this.props.navigator}
                onCreditCardAdded={this.onCreditCardAdded.bind(this)}
                onBillingAddressAdded={this.onBillingAddressAdded.bind(this)}
                billingAddress={this.state.billingAddress}
                creditCardFormParams={this.state.creditCardFormParams}
                creditCardToken={this.state.creditCardToken}
              />
            )}
          </View>

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
                onPress={this.canCreateBidder() ? () => this.register() : null}
                disabled={!this.canCreateBidder()}
              />
            </Flex>
          </View>
        </Container>
      </BiddingThemeProvider>
    )
  }
}

const LinkText = styled.Text`
  text-decoration-line: underline;
`

export const RegistrationScreen = createFragmentContainer(Registration, {
  sale: graphql`
    fragment Registration_sale on Sale {
      id
      end_at
      is_preview
      live_start_at
      name
      start_at
    }
  `,
  me: graphql`
    fragment Registration_me on Me {
      has_credit_cards
    }
  `,
})
