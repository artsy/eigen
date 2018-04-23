import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Button } from "../Components/Button"
import { Container } from "../Components/Container"
import { Margins } from "../Components/Margins"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"

import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"

interface SelectMaxBidProps extends ViewProperties {
  sale_artwork: SelectMaxBid_sale_artwork
}

interface SelectMaxBidState {
  selectedBidIndex: number
}

export class SelectMaxBid extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: 0,
  }
  render() {
    // TODO metaphysics should return formatted values
    const bids =
      (this.props.sale_artwork &&
        this.props.sale_artwork.increments &&
        this.props.sale_artwork.increments.map(i => ({ label: i.display, value: i.cents }))) ||
      []
    return (
      <Container>
        <Title style={Margins.m1}>Your max bid</Title>

        <MaxBidPicker
          bids={bids}
          onValueChange={(_, index) => this.setState({ selectedBidIndex: index })}
          selectedValue={this.state.selectedBidIndex}
        />

        <Button text="NEXT" onPress={() => null} />
      </Container>
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
    }
  `
)
