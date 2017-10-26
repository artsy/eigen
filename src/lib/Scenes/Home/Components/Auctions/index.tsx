import * as React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SectionTitle from "../SectionTitle"
import AuctionItem from "./Components/AuctionItem"

class Auctions extends React.Component<any, any> {
  render() {
    const auctions = this.props.auctions

    return (
      <View>
        <SectionTitle>Live Auctions</SectionTitle>
        <FlatList
          data={auctions}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={itemData => {
            return <AuctionItem key={itemData.index} auction={itemData.item} />
          }}
        />
      </View>
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
