import React from "react"
import { View, ViewProperties } from "react-native"
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

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { Checkbox } from "../Components/Checkbox"

interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  bid: {
    display: string
    cents: number
  }
}

export class ConfirmFirstTimeBid extends React.Component<ConfirmBidProps> {
  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
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

            <Divider mb={2} />

            <Row m={4}>
              <Col>
                <SerifSemibold16>Credit card</SerifSemibold16>
              </Col>
              <Col alignItems="flex-end">
                <Serif16 color="purple100">Add</Serif16>
              </Col>
            </Row>

            <Divider mb={2} />

            <Row m={4}>
              <Col>
                <SerifSemibold16>Billing address</SerifSemibold16>
              </Col>
              <Col alignItems="flex-end">
                <Serif16 color="purple100">Add</Serif16>
              </Col>
            </Row>

            <Divider />
          </View>

          <View>
            <Checkbox alignSelf="center" m={3}>
              <Serif16 mt={2} textAlign="center" color="black60">
                Agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
              </Serif16>
            </Checkbox>

            <Flex m={4}>
              <Button text="Place Bid" onPress={() => null} />
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
