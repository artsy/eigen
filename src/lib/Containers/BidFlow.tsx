import React from "react"
import { ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { MaxBidScreen } from "../Components/Bidding/Screens/SelectMaxBid"

import { BidFlow_sale_artwork } from "__generated__/BidFlow_sale_artwork.graphql"
import { BidFlowQuery } from "__generated__/BidFlowQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { BidFlow_me } from "../../__generated__/BidFlow_me.graphql"

interface BidFlowProps extends ViewProperties {
  sale_artwork: BidFlow_sale_artwork
  me: BidFlow_me
}

class BidFlow extends React.Component<BidFlowProps> {
  render() {
    return (
      <TimeOffsetProvider>
        <NavigatorIOS
          navigationBarHidden={true}
          initialRoute={{
            component: MaxBidScreen,
            title: "", // title is required, though we don't use it because our navigation bar is hidden.
            passProps: this.props,
          }}
          style={{ flex: 1 }}
        />
      </TimeOffsetProvider>
    )
  }
}

export const BidFlowFragmentContainer = createFragmentContainer(BidFlow, {
  sale_artwork: graphql`
    fragment BidFlow_sale_artwork on SaleArtwork {
      ...SelectMaxBid_sale_artwork
    }
  `,
  me: graphql`
    fragment BidFlow_me on Me {
      ...SelectMaxBid_me
    }
  `,
})

export const BidFlowRenderer: React.SFC<{ artworkID?: string; saleID: string }> = ({ artworkID, saleID }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <QueryRenderer<BidFlowQuery>
      environment={defaultEnvironment}
      query={graphql`
        query BidFlowQuery($artworkID: String!, $saleID: String!) {
          artwork(id: $artworkID) {
            sale_artwork: saleArtwork(saleID: $saleID) {
              ...BidFlow_sale_artwork
            }
          }
          me {
            ...BidFlow_me
          }
        }
      `}
      cacheConfig={{ force: true }} // We want to always fetch latest bid increments.
      variables={{
        // @ts-ignore STRICTNESS_MIGRATION
        artworkID,
        saleID,
      }}
      render={renderWithLoadProgress<BidFlowQuery["response"]>(props => (
        // @ts-ignore STRICTNESS_MIGRATION
        <BidFlowFragmentContainer sale_artwork={props.artwork.sale_artwork} me={props.me} />
      ))}
    />
  )
}
