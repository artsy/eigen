import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Flex } from "../Elements/Flex"

import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"
import { ConfirmBidScreen } from "./ConfirmBid"

import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"

interface SelectMaxBidProps extends ViewProperties {
  sale_artwork: SelectMaxBid_sale_artwork
  navigator: NavigatorIOS
}

interface SelectMaxBidState {
  selectedBidIndex: number
}

export class SelectMaxBid extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: 0,
  }

  onPressNext = () => {
    this.props.navigator.push({
      component: ConfirmBidScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bid: this.props.sale_artwork.increments[this.state.selectedBidIndex],
      },
    })
  }

  render() {
    const bids =
      (this.props.sale_artwork &&
        this.props.sale_artwork.increments &&
        this.props.sale_artwork.increments.map(i => ({ label: i.display, value: i.cents }))) ||
      []

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <Title>Your max bid</Title>

          <MaxBidPicker
            bids={bids}
            onValueChange={(_, index) => this.setState({ selectedBidIndex: index })}
            selectedValue={this.state.selectedBidIndex}
          />

          <Flex m={4}>
            <Button text="NEXT" onPress={this.onPressNext} />
          </Flex>
        </Container>
      </BiddingThemeProvider>
    )
  }
}

export const MaxBidScreen = createFragmentContainer(
  SelectMaxBid,
  graphql`
    fragment SelectMaxBid_sale_artwork on SaleArtwork {
      increments {
        display
        cents
      }
      ...ConfirmBid_sale_artwork
    }
  `
)
