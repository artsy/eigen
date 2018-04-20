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

export class SelectMaxBid extends React.Component<SelectMaxBidProps> {
  render() {
    // TODO metaphysics should return formatted values
    const bids =
      (this.props.sale_artwork &&
        this.props.sale_artwork.bid_increments &&
        this.props.sale_artwork.bid_increments.map(d => ({ label: d.toString(), value: d }))) ||
      []
    return (
      <Container>
        <Title style={Margins.m1}>Your max bid</Title>

        <MaxBidPicker bids={bids} />

        <Button text="NEXT" onPress={() => null} />
      </Container>
    )
  }
}

export const MaxBidScreen = createFragmentContainer(
  SelectMaxBid,
  graphql`
    fragment SelectMaxBid_sale_artwork on SaleArtwork {
      bid_increments
    }
  `
)
