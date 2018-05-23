import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import styled from "styled-components/native"

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

import { Checkbox } from "../Components/Checkbox"
import { Timer } from "../Components/Timer"
import { BillingAddress } from "./BillingAddress"
import { ConfirmBidProps } from "./ConfirmBid"

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
}

interface ConformBidState {
  billingAddress?: Address
  creditCardToken?: string // TODO: change this interface accrodingly when adapting stripe
  conditionsOfSaleChecked: boolean
  isLoading: boolean
}

export class ConfirmFirstTimeBid extends React.Component<ConfirmBidProps, ConformBidState> {
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
    // TODO: implement this function: https://artsyproduct.atlassian.net/browse/PURCHASE-89
    console.warn("The function showCreditCardForm() is not implemented yet.")
  }

  showBillingAddressForm() {
    this.props.navigator.push({
      component: BillingAddress,
      title: "",
      passProps: {
        onSubmit: this.onBillingAddressAdded,
        billingAddress: this.state.billingAddress,
      },
    })
  }

  onBillingAddressAdded = (values: Address) => {
    this.props.navigator.pop()
    this.setState({ billingAddress: values })
  }

  render() {
    const { billingAddress } = this.state

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

              <SerifItalic14 color="black60">
                {this.props.sale_artwork.artwork.title}, <Serif14>{this.props.sale_artwork.artwork.date}</Serif14>
              </SerifItalic14>
            </Flex>

            <Divider mb={2} />

            <Row p={4}>
              <Col>
                <SerifSemibold16>Max bid</SerifSemibold16>
              </Col>
              <Col alignItems="center" justifyContent="flex-end" flexDirection="row">
                <Serif16>{this.props.bid.display}</Serif16>
                <Sans12 color="purple100" ml={3} mb={1}>
                  Edit
                </Sans12>
              </Col>
            </Row>

            <Divider mb={2} />

            <TouchableWithoutFeedback onPress={() => this.showCreditCardForm()}>
              <Row p={4}>
                <Col>
                  <SerifSemibold16>Credit card</SerifSemibold16>
                </Col>
                <Col alignItems="flex-end">
                  <Sans12 color="purple100" ml={3} mb={2}>
                    Add
                  </Sans12>
                </Col>
              </Row>
            </TouchableWithoutFeedback>

            <Divider mb={2} />

            <TouchableWithoutFeedback onPress={() => this.showBillingAddressForm()}>
              <Row p={4}>
                <Col>
                  <SerifSemibold16>Billing address</SerifSemibold16>
                </Col>
                <Col alignItems="flex-end">
                  {billingAddress && <Serif16 numberOfLines={1}>{`${this.formatAddress(billingAddress)}`}</Serif16>}
                </Col>
                <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
                  <Sans12 color="purple100" ml={3} mb={2}>
                    {Boolean(billingAddress) ? "Edit" : "Add"}
                  </Sans12>
                </Col>
              </Row>
            </TouchableWithoutFeedback>

            <Divider />
          </View>

          <View>
            <Checkbox justifyContent="center">
              <Serif14 mt={2} color="black60">
                You agree to <LinkText onPress={this.onPressConditionsOfSale}>Conditions of Sale</LinkText>.
              </Serif14>
            </Checkbox>

            <Flex m={4}>
              <Button text="Place Bid" onPress={() => null} />
            </Flex>
          </View>
        </Container>
      </BiddingThemeProvider>
    )
  }

  private formatAddress(address: Address) {
    return [address.addressLine1, address.addressLine2, address.city, address.state].filter(el => el).join(" ")
  }
}

const LinkText = styled.Text`
  text-decoration-line: underline;
`
