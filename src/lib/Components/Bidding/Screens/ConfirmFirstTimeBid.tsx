import React from "react"
import { NativeModules, TouchableWithoutFeedback, View } from "react-native"
const Emission = NativeModules.Emission || {}
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Schema, screenTrack, track } from "../../../utils/track"

import { Flex } from "../Elements/Flex"
import { Serif14, SerifItalic14, SerifSemibold14, SerifSemibold18 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { BidInfoRow } from "../Components/BidInfoRow"
import { Button } from "../Components/Button"
import { Checkbox } from "../Components/Checkbox"
import { Container } from "../Components/Containers"
import { Divider } from "../Components/Divider"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { BillingAddress } from "./BillingAddress"
import { ConfirmBidProps } from "./ConfirmBid"

import { Colors } from "lib/data/colors"
import stripe from "tipsi-stripe"
import { CreditCardForm } from "./CreditCardForm"

stripe.setOptions({
  publishableKey: Emission.stripePublishableKey,
  // merchantId: "MERCHANT_ID", // Optional
  // androidPayMode: "test", // Android only
})

// values from the Tipsi PaymentCardTextField component
export interface PaymentCardTextFieldParams {
  number: string
  expMonth: string
  expYear: string
  cvc: string
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
}

interface ConfirmBidState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken // TODO: change this interface accrodingly when adapting stripe
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

interface StripeToken {
  tokenId: string
  created: number
  livemode: 1 | 0
  card: any
  bankAccount: any
  extra: any
}

const theme = {
  primaryBackgroundColor: Colors.White,
  secondaryBackgroundColor: Colors.GrayLight,
  primaryForegroundColor: Colors.GrayBold,
  secondaryForegroundColor: Colors.GrayRegular,
  accentColor: Colors.PurpleRegular,
  errorColor: Colors.RedRegular,
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmFirstTimeBid extends React.Component<ConfirmBidProps, ConfirmBidState> {
  state = {
    billingAddress: undefined,
    creditCardToken: null,
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
    // Get token here or just set state? Getting token gives us card type for free
    const token = await stripe.createTokenWithCard(params)
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded = (values: Address) => {
    this.setState({ billingAddress: values })
  }

  @track({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  placeBid() {
    return null
  }

  maxBidPressed() {
    this.props.navigator.pop()
  }

  render() {
    const { live_start_at, end_at } = this.props.sale_artwork.sale
    const { billingAddress, creditCardToken: token } = this.state

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Flex alignItems="center">
            <Title mb={3}>Confirm your bid</Title>
            <Timer liveStartsAt={live_start_at} endsAt={end_at} />
          </Flex>

          <View>
            <Flex m={4} mt={0} alignItems="center">
              <SerifSemibold18>{this.props.sale_artwork.artwork.artist_names}</SerifSemibold18>
              <SerifSemibold14>Lot {this.props.sale_artwork.lot_label}</SerifSemibold14>

              <SerifItalic14 color="black60">
                {this.props.sale_artwork.artwork.title}, <Serif14>{this.props.sale_artwork.artwork.date}</Serif14>
              </SerifItalic14>
            </Flex>

            <Divider mb={2} />

            <BidInfoRow label="Max bid" value={this.props.bid.display} onPress={() => this.maxBidPressed()} />

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
          </View>

          <View>
            <Checkbox justifyContent="center">
              <Serif14 mt={2} color="black60">
                You agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
              </Serif14>
            </Checkbox>

            <Flex m={4}>
              <Button text="Place Bid" onPress={() => this.placeBid()} />
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

export const ConfirmFirstTimeBidScreen = createFragmentContainer(
  ConfirmFirstTimeBid,
  graphql`
    fragment ConfirmFirstTimeBid_sale_artwork on SaleArtwork {
      sale {
        id
        live_start_at
        end_at
      }
      artwork {
        id
        title
        date
        artist_names
      }
      lot_label
      ...BidResult_sale_artwork
    }
  `
)
