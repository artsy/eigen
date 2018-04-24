import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { MaxBidScreen } from "../Components/Bidding/Screens/SelectMaxBid"

import { BidFlow_sale_artwork } from "__generated__/BidFlow_sale_artwork.graphql"

interface BidFlowProps extends ViewProperties {
  sale_artwork: BidFlow_sale_artwork
}

class BidFlow extends React.Component<BidFlowProps> {
  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: MaxBidScreen,
          title: "", // title is required, though we don't use it because our navigation bar is hidden.
          passProps: {
            sale_artwork: this.props.sale_artwork,
          },
        }}
        style={{ flex: 1 }}
      />
    )
  }
}

export default createFragmentContainer(
  BidFlow,
  graphql`
    fragment BidFlow_sale_artwork on SaleArtwork {
      ...SelectMaxBid_sale_artwork
    }
  `
)
