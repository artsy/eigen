import * as React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import SectionTitle from "../SectionTitle"
import AuctionItem from "./Components/AuctionItem"

const Container = styled.View`
  flex: 1;
  padding: 10px;
`

class Auctions extends React.Component<any, any> {
  render() {
    const auctions = this.props.auctions

    return (
      <Container>
        <SectionTitle>Live Auctions</SectionTitle>
        <FlatList
          data={auctions}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={itemData => {
            return <AuctionItem key={itemData.index} auction={itemData.item} />
          }}
        />
      </Container>
    )
  }
}

export default createFragmentContainer(Auctions, {
  auctions: graphql`
    fragment Auctions_auctions on Sale @relay(plural: true) {
      ...AuctionItem_auction
    }
  `,
})
