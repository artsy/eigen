import React from "react"
import { NavigatorIOS, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
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
import { Bid, BidderPositionResult } from "../types"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { metaphysics } from "../../../metaphysics"

import { BidResultScreen } from "./BidResult"

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"

export interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  bid: Bid
  relay?: RelayPaginationProp
  navigator?: NavigatorIOS
  refreshSaleArtwork?: () => void
}

interface ConfirmBidState {
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

const MAX_POLL_ATTEMPTS = 20

export const bidderPositionMutation = graphql`
  mutation ConfirmBidMutation($input: BidderPositionInput!) {
    createBidderPosition(input: $input) {
      result {
        status
        message_header
        message_description_md
        position {
          id
          suggested_next_bid {
            cents
            display
          }
        }
      }
    }
  }
`

export const queryForBidPosition = (bidderPositionID: string) => {
  return metaphysics({
    query: `
      {
        me {
          bidder_position(id: "${bidderPositionID}") {
            status
            message_header
            message_description_md
            position {
              id
              suggested_next_bid {
                cents
                display
              }
            }
          }
        }
      }
    `,
  })
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmBid extends React.Component<ConfirmBidProps, ConfirmBidState> {
  state = { conditionsOfSaleChecked: false, isLoading: false }

  private pollCount = 0

  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  @track({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  placeBid() {
    this.setState({ isLoading: true })

    commitMutation(this.props.relay.environment, {
      onCompleted: (results, errors) => {
        this.verifyBidPosition(results, errors)
      },
      onError: e => {
        this.setState({ isLoading: false })
        // TODO catch error!
        // this.verifyAndShowBidResult(null, e)
        console.error("error!", e, e.message)
      },
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

  verifyBidPosition(results, errors) {
    // TODO: Need to handle if the results object is empty, for example if errors occurred and no request was made
    // TODO: add analytics for errors
    const { result } = results.createBidderPosition

    if (!errors && result.status === "SUCCESS") {
      this.bidPlacedSuccessfully(result.position.id)
    } else {
      this.presentBidResult(result)
    }
  }

  @track({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  bidPlacedSuccessfully(positionId) {
    queryForBidPosition(positionId).then(this.checkBidPosition.bind(this))
  }

  checkBidPosition(result) {
    const { bidder_position } = result.data.me

    if (bidder_position.status === "PENDING" && this.pollCount < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      setTimeout(() => queryForBidPosition(bidder_position.position.id).then(this.checkBidPosition.bind(this)), 1000)

      this.pollCount += 1
    } else {
      this.presentBidResult(bidder_position)
    }
  }

  presentBidResult(bidderPositionResult: BidderPositionResult) {
    if (this.props.refreshSaleArtwork) {
      this.props.refreshSaleArtwork()
    }
    this.props.navigator.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bidderPositionResult,
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

              <SerifItalic14 color="black60" textAlign="center">
                {this.props.sale_artwork.artwork.title}, <Serif14>{this.props.sale_artwork.artwork.date}</Serif14>
              </SerifItalic14>
            </Flex>

            <Divider mb={2} />

            <BidInfoRow label="Max bid" value={this.props.bid.display} onPress={() => this.maxBidPressed()} />

            <Divider mb={9} />
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
                onPress={this.state.conditionsOfSaleChecked ? () => this.placeBid() : null}
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

export const ConfirmBidScreen = createFragmentContainer(
  ConfirmBid,
  graphql`
    fragment ConfirmBid_sale_artwork on SaleArtwork {
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
