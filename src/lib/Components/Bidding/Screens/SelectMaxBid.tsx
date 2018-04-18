import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Button } from "../Components/Button"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { Title } from "../Components/Title"

import { SelectMaxBid_saleArtwork } from "__generated__/SelectMaxBid_saleArtwork.graphql"

interface SelectMaxBidProps /* extends ViewProperties */ {
  saleArtworkID: string
  sale_artwork: SelectMaxBid_saleArtwork
}

export class SelectMaxBid extends React.Component<SelectMaxBidProps> {
  render() {
    // TODO metaphysics should return formatted values
    const bids = this.props.sale_artwork.bid_increments.map(d => ({ label: d.toString(), value: d }))
    return (
      <Container>
        <Title>Your max bid</Title>

        <MaxBidPicker bids={bids} />

        <Button text="NEXT" onPress={() => null} />
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;
`

export const MaxBidScreen = createFragmentContainer(
  SelectMaxBid,
  graphql`
    fragment SelectMaxBid_saleArtwork on SaleArtwork {
      bid_increments
    }
  `
)
