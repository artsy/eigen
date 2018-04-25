import React from "react"
import { NavigatorIOS, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer,graphql,  RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { Flex } from "../Elements/Flex"
import { Col, Row } from "../Elements/Grid"
import {
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
import { BidResult } from "./BidResult"

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"

interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  bid: {
    display: string
    cents: number
  }
  relay?: RelayPaginationProp
  navigator?: NavigatorIOS
}

export class ConfirmBid extends React.Component<ConfirmBidProps> {
  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }
  placeBid() {
    const selectedBidAmount = this.props.bid.cents
    const input = {
      sale_id: this.props.sale_artwork.sale.id,
      artwork_id: this.props.sale_artwork.artwork.id,
      max_bid_amount_cents: selectedBidAmount,
    }
    const query = graphql`
      mutation ConfirmBidMutation($input: BidderPositionInput!) {
        createBidderPosition(input: $input) {
          position {
            suggested_next_bid_cents
          }
        }
      }
    `
    console.log(input)
    const environment = this.props.relay.environment
    try {
      commitMutation(environment, {
        onCompleted: this.showBidResult.bind(this),
        onError: e => {
          console.log("ERROR", e)
          this.showBidResult(null, e)
        },
        mutation: query,
        variables: {
          input,
        },
      })
    } catch (e) {
      console.log("ERROR", e)
    }
  }

  showBidResult(result, error) {
    console.log("result", result, error)
    this.props.navigator.push({
      component: BidResult,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bid: this.props.bid,
        winning: true,
      },
    })
  }

  render() {
    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Title>Confirm your bid</Title>

          <View>
            <Flex m={4} alignItems="center">
              <SerifSemibold18>{this.props.sale_artwork.artwork.artist_names}</SerifSemibold18>
              <SerifSemibold14>Lot {this.props.sale_artwork.lot_label}</SerifSemibold14>

              <SerifItalic14 color="black60">
                {this.props.sale_artwork.artwork.title}, <Serif14>{this.props.sale_artwork.artwork.date}</Serif14>
              </SerifItalic14>
            </Flex>

            <Divider mb={2} />

            <Row m={4}>
              <Col>
                <SerifSemibold16>Max bid</SerifSemibold16>
              </Col>
              <Col alignItems="flex-end">
                <Serif16>{this.props.bid.display}</Serif16>
              </Col>
            </Row>

            <Divider />
          </View>

          <View>
            <Serif14 mb={3} color="black60" textAlign="center">
              You agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
            </Serif14>

            <Flex m={4}>
              <Button text="Place Bid" onPress={() => { this.placeBid() }} />
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
    }
  `
)
