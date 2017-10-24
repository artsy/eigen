import * as React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SectionTitle from "../SectionTitle"
import AuctionItem from "./Components/AuctionItem"

export class Auctions extends React.Component<any, any> {
  render() {
    const items = this.props
    console.log(items)

    // .map((item, i) => <AuctionItem auction={{ item }} />)

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
    fragment Auctions_auctions on Query {
      sales(live: true, is_auction: true) {
        ...AuctionItem_auction
      }
    }
  `,
})
