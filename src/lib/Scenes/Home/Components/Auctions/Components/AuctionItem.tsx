import * as React from "react"
import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

class AuctionItem extends React.Component<any, any> {
  render() {
    console.log(this.props)
    return <View />
  }
}

export default createFragmentContainer(AuctionItem, {
  auction: graphql`
    fragment AuctionItem_auction on Sale {
      id
      name
      is_open
      is_live_open
      start_at
      registration_ends_at
      live_start_at
      cover_image {
        cropped(width: 180, height: 130, version: "medium") {
          url
        }
      }
    }
  `,
})
