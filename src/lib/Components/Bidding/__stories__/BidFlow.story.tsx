import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { BidFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import createEnvironment from "../../../relay/createEnvironment"

import { NavigatorIOS } from "react-native"
import BidFlow from "../../../Containers/BidFlow"
import { BidResultScreen } from "../Screens/BidResult"
import { BillingAddress } from "../Screens/BillingAddress"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { ConfirmFirstTimeBid } from "../Screens/ConfirmFirstTimeBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

const testSaleArtworkID = "5ae73b417622dd026f0fe473"
const testArtworkID = "ran-hwang-ephemeral-blossom-pp"
const testSaleID = "cityarts-benefit-auction-2018"

const selectMaxBidQuery = graphql`
  query BidFlowSelectMaxBidRendererQuery($saleArtworkID: String!) {
    sale_artwork(id: $saleArtworkID) {
      ...SelectMaxBid_sale_artwork
    }
  }
`

const bidResultQuery = graphql`
  query BidFlowBidResultScreenRendererQuery($saleArtworkID: String!) {
    sale_artwork(id: $saleArtworkID) {
      ...BidResult_sale_artwork
    }
  }
`

const BidFlowStoryRenderer: React.SFC<any> = ({ render, query, saleArtworkID }) => {
  return <QueryRenderer environment={createEnvironment()} query={query} variables={{ saleArtworkID }} render={render} />
}

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return (
      <BidFlowRenderer
        render={renderWithLoadProgress(BidFlow)}
        artworkID={testArtworkID}
        saleID={testSaleID}
        intent="bid"
      />
    )
  })
  .add("Select Max Bid", () => (
    <BidFlowStoryRenderer
      render={renderWithLoadProgress(MaxBidScreen)}
      query={selectMaxBidQuery}
      saleArtworkID={testSaleArtworkID}
      intent="bid"
    />
  ))
  .add("Confirm Bid", () => {
    return (
      <ConfirmBid
        sale_artwork={{
          sale: {
            id: "1",
            live_start_at: "2018-06-11T01:00:00+00:00",
            end_at: null,
          },
          artwork: {
            id: "1",
            title: "Morgan Hill (Prototype)",
            date: "1973",
            artist_names: "Lewis balts",
          },
          lot_label: "1",
        }}
        bid={{ display: "$45,000", cents: 4500000 }}
      />
    )
  })
  .add("Confirm Bid (first time)", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: ConfirmFirstTimeBid,
          title: "",
          passProps: {
            sale_artwork: {
              sale: {
                id: "1",
                live_start_at: "2018-06-11T01:00:00+00:00",
                end_at: null,
              },
              artwork: {
                id: "1",
                title: "Morgan Hill (Prototype)",
                date: "1973",
                artist_names: "Lewis balts",
              },
              lot_label: "1",
            },
            bid: { display: "$45,000", cents: 4500000 },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Bidding Result (winning)", () => {
    const status = "SUCCESS"
    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: true,
          status,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
        intent="bid"
      />
    )
  })
  .add("Bidding Result (not highest bid)", () => {
    const status = "OUTBID"
    const messageHeader = "Your bid wasn’t high enough"
    const messageDescriptionMd = `
      Another bidder placed a higher max bid or the same max bid before you did.
      Bid again to take the lead.
    `

    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: false,
          status,
          message_header: messageHeader,
          message_description_md: messageDescriptionMd,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
        intent="bid"
      />
    )
  })
  .add("Billing Address", () => {
    return <BillingAddress />
  })
  .add("Bidding Result (live bidding started)", () => {
    const status = "ERROR_LIVE_BIDDING_STARTED"
    const messageHeader = "Live bidding has started"
    const messageDescriptionMd = `
      Sorry, your bid wasn’t received before live bidding started.
      To continue bidding, please [join the live auction](http://live-staging.artsy.net/).
    `

    return (
      <BidFlowStoryRenderer
        render={renderWithLoadProgress(BidResultScreen, {
          winning: false,
          status,
          message_header: messageHeader,
          message_description_md: messageDescriptionMd,
        })}
        query={bidResultQuery}
        saleArtworkID={testSaleArtworkID}
        intent="bid"
      />
    )
  })
