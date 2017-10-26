import * as React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SectionTitle from "../SectionTitle"
import AuctionItem from "./Components/AuctionItem"

class Auctions extends React.Component<any, any> {
  render() {
    const auctions = this.props.auctions
    const items = auctions.map((item, i) => <AuctionItem key={i} auction={item} />)

    return (
      <View>
        <SectionTitle>Live Auctions</SectionTitle>
        {items}
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
