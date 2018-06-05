import React from "react"
import { NativeModules, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql } from "react-relay"
import { PayloadError } from "relay-runtime"
import styled from "styled-components/native"
import stripe from "tipsi-stripe"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { metaphysics } from "../../../metaphysics"
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

import { BidResultScreen } from "./BidResult"
import { BillingAddress } from "./BillingAddress"
import { Bid, bidderPositionMutation, ConfirmBidProps } from "./ConfirmBid"
import { CreditCardForm } from "./CreditCardForm"

const Emission = NativeModules.Emission || {}

stripe.setOptions({ publishableKey: Emission.stripePublishableKey })

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

interface StripeToken {
  tokenId: string
  created: number
  livemode: 1 | 0
  card: any
  bankAccount: any
  extra: any
}

interface ConfirmBidState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

const MAX_POLL_ATTEMPTS = 20

const creditCardMutation = graphql`
  mutation ConfirmFirstTimeBidMutation($input: CreditCardInput!) {
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

  private pollCount = 0

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

  @track({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  registerAndPlaceBid() {
    this.setState({ isLoading: true })

    commitMutation(this.props.relay.environment, {
      onCompleted: () => this.createBidderPosition(),
      onError: e => console.error(e, e.message),
      mutation: creditCardMutation,
      variables: {
        input: {
          token: this.state.creditCardToken.tokenId,
        },
      },
    })
  }

  createBidderPosition() {
    commitMutation(this.props.relay.environment, {
      onCompleted: (results, errors) => this.verifyBidPosition(results, errors),
      onError: e => console.error(e, e.message),
      mutation: bidderPositionMutation,
      variables: {
        input: {
          sale_id: this.props.sale_artwork.sale.id,
          artwork_id: this.props.sale_artwork.artwork.id,
          max_bid_amount_cents: this.props.bid.cents,
        },
      },
    })
  }

  verifyBidPosition(results: any, errors: PayloadError[] | null | undefined) {
    const status = results.createBidderPosition.result.status

    if (!errors && status === "SUCCESS") {
      this.bidPlacedSuccessfully(results)
    } else {
      const message_header = results.createBidderPosition.result.message_header
      const message_description_md = results.createBidderPosition.result.message_description_md
      this.showBidResult(false, status, message_header, message_description_md)
    }
  }

  @track({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  bidPlacedSuccessfully(results) {
    const positionId = results.createBidderPosition.result.position.id
    this.queryForBidPosition(positionId).then(this.checkBidPosition.bind(this))
  }

  queryForBidPosition(bidderPositionID: string) {
    const query = `
        {
          me {
            bidder_position(id: "${bidderPositionID}") {
              status
              message_header
              message_description_md
              position {
                id
                processed_at
                is_active
                suggested_next_bid {
                  cents
                  display
                }
              }
            }
          }
        }
      `
    return metaphysics({ query })
  }

  checkBidPosition(result) {
    const bidderPosition = result.data.me.bidder_position.position
    const status = result.data.me.bidder_position.status
    if (status === "WINNING") {
      this.showBidResult(true, "WINNING")
    } else if (status === "PENDING") {
      if (this.pollCount > MAX_POLL_ATTEMPTS) {
        const md = `We're receiving a high volume of traffic and your bid is still processing.  \
If you don’t receive an update soon, please contact [support@artsy.net](mailto:support@artsy.net). `

        this.showBidResult(false, "PROCESSING", "Bid Processing", md)
      } else {
        // initiating new request here (vs setInterval) to make sure we wait for the previus calls to return before making a new one
        setTimeout(() => {
          this.queryForBidPosition(bidderPosition.id).then(this.checkBidPosition.bind(this))
        }, 1000)
        this.pollCount += 1
      }
    } else {
      this.showBidResult(
        false,
        status,
        result.data.me.bidder_position.message_header,
        result.data.me.bidder_position.message_description_md,
        result.data.me.bidder_position.position.suggested_next_bid
      )
    }
  }

  showBidResult(
    winning: boolean,
    status: string,
    messageHeader?: string,
    messageDescriptionMd?: string,
    suggestedNextBid?: Bid
  ) {
    this.props.navigator.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        status,
        message_header: messageHeader,
        message_description_md: messageDescriptionMd,
        winning,
        bid: this.props.bid,
        suggested_next_bid: suggestedNextBid,
      },
    })

    this.setState({ isLoading: false })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
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
            <Checkbox justifyContent="center" onPress={() => this.conditionsOfSalePressed()}>
              <Serif14 mt={2} color="black60">
                You agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
              </Serif14>
            </Checkbox>

            <Flex m={4}>
              <Button
                text="Place Bid"
                inProgress={this.state.isLoading}
                selected={this.state.isLoading}
                onPress={this.state.conditionsOfSaleChecked ? () => this.registerAndPlaceBid() : null}
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
