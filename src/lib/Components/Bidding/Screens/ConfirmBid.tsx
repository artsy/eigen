import React from "react"
import { NavigatorIOS, TouchableWithoutFeedback, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { Schema, screenTrack, track } from "../../../utils/track"

import { Flex } from "../Elements/Flex"
import { Col, Row } from "../Elements/Grid"
import {
  Sans12,
  Serif14,
  Serif16,
  SerifItalic14,
  SerifSemibold14,
  SerifSemibold16,
  SerifSemibold18,
} from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Divider } from "../Components/Divider"
import { Title } from "../Components/Title"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { metaphysics } from "../../../metaphysics"

import { BidResultScreen } from "./BidResult"

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { Checkbox } from "../Components/Checkbox"
import { Timer } from "../Components/Timer"

interface Bid {
  display: string
  cents: number
}

export interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  bid: Bid
  relay?: RelayPaginationProp
  navigator?: NavigatorIOS
}

interface ConformBidState {
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

const MAX_POLL_ATTEMPTS = 20

const bidderPositionMutation = graphql`
  mutation ConfirmBidMutation($input: BidderPositionInput!) {
    createBidderPosition(input: $input) {
      result {
        position {
          id
        }
        status
        message_header
        message_description_md
      }
    }
  }
`
@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmBid extends React.Component<ConfirmBidProps, ConformBidState> {
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

  verifyBidPosition(results, errors) {
    // TODO: Need to handle if the results object is empty, for example if errors occurred and no request was made
    // TODO: add analytics for errors
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
    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Flex alignItems="center">
            <Title mb={3}>Confirm your bid</Title>
            <Timer timeLeftInMilliseconds={1000 * 60 * 20} />
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

            <TouchableWithoutFeedback onPress={() => this.maxBidPressed()}>
              <Row m={4}>
                <Col>
                  <SerifSemibold16>Max bid</SerifSemibold16>
                </Col>
                <Col alignItems="center" justifyContent="flex-end" flexDirection="row">
                  <Serif16>{this.props.bid.display}</Serif16>
                  <Sans12 color="purple100" ml={3} mb={2}>
                    Edit
                  </Sans12>
                </Col>
              </Row>
            </TouchableWithoutFeedback>

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
