import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { ViewProperties } from "react-native"

import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { MaxBidScreen } from "../Components/Bidding/Screens/SelectMaxBid"

import { BidFlow_sale_artwork } from "__generated__/BidFlow_sale_artwork.graphql"
import { BidFlowQuery } from "__generated__/BidFlowQuery.graphql"
import { ModalHeader } from "lib/Components/ModalHeader"
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
          initialRoute={{
            component: MaxBidScreen,
            passProps: this.props,
          }}
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

export const BidFlowQueryRenderer: React.FC<{ artworkID?: string; saleID: string }> = ({ artworkID, saleID }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <>
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
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          artworkID,
          saleID,
        }}
        render={renderWithLoadProgress<BidFlowQuery["response"]>((props) => (
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          <BidFlowFragmentContainer sale_artwork={props.artwork.sale_artwork} me={props.me} />
        ))}
      />
      <ModalHeader />
    </>
  )
}
