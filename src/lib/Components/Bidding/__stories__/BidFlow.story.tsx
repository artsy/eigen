import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { BidFlowRenderer, RegistrationFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import createEnvironment from "../../../relay/createEnvironment"

import { NavigatorIOS } from "react-native"
import BidFlow from "../../../Containers/BidFlow"
import RegistrationFlow from "../../../Containers/RegistrationFlow"
import { BillingAddress } from "../Screens/BillingAddress"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { Registration } from "../Screens/Registration"
import { RegistrationResult, RegistrationStatus } from "../Screens/RegistrationResult"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

const testSaleArtworkID = "5b1e4d29275b2446aa139f37"
const testArtworkID = "david-lynch-hand"
const testSaleID = "david-lynch-foundation-benefit-auction-2018"

const selectMaxBidQuery = graphql`
  query BidFlowSelectMaxBidRendererQuery($saleArtworkID: String!) {
    sale_artwork(id: $saleArtworkID) {
      ...SelectMaxBid_sale_artwork
    }
  }
`

const BidFlowStoryRenderer: React.SFC<any> = ({ render, query, saleArtworkID }) => {
  return <QueryRenderer environment={createEnvironment()} query={query} variables={{ saleArtworkID }} render={render} />
}

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlowRenderer render={renderWithLoadProgress(BidFlow)} artworkID={testArtworkID} saleID={testSaleID} />
  })
  .add("Select Max Bid", () => (
    <BidFlowStoryRenderer
      render={renderWithLoadProgress(MaxBidScreen)}
      query={selectMaxBidQuery}
      saleArtworkID={testSaleArtworkID}
    />
  ))
  .add("Confirm Bid (registered)", () => {
    return (
      <ConfirmBid
        sale_artwork={{
          _id: "saleartwork12345",
          sale: { id: "sale-id", live_start_at: "2018-06-11T01:00:00+00:00", end_at: null },
          artwork: { id: "artwork-id", title: "Morgan Hill (Prototype)", date: "1973", artist_names: "Lewis balts" },
          lot_label: "2",
        }}
        me={{ has_qualified_credit_cards: false, bidders: [{ qualified_for_bidding: true }] }}
        bid={{ display: "$45,000", cents: 4500000 }}
      />
    )
  })
  .add("Confirm Bid (not registered, no qualified cc)", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: ConfirmBid,
          title: "",
          passProps: {
            sale_artwork: {
              sale: { id: "1", live_start_at: "2018-06-11T01:00:00+00:00", end_at: null },
              artwork: { id: "1", title: "Morgan Hill (Prototype)", date: "1973", artist_names: "Lewis balts" },
              lot_label: "1",
            },
            me: { has_qualified_credit_cards: false, bidders: [] },
            bid: { display: "$45,000", cents: 4500000 },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Confirm Bid (not registered, has qualified credit cards)", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: ConfirmBid,
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
            me: {
              has_qualified_credit_cards: true,
              bidders: [],
            },
            bid: { display: "$45,000", cents: 4500000 },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Billing Address", () => {
    return <BillingAddress />
  })
  .add("Show Registration flow", () => {
    return <RegistrationFlowRenderer render={renderWithLoadProgress(RegistrationFlow)} saleID={testSaleID} />
  })
  .add("Registration (no qualified cc on file), live sale starting in future", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: Registration,
          title: "",
          passProps: {
            sale: {
              id: "1",
              live_start_at: "2029-06-11T01:00:00+00:00",
              end_at: null,
              name: "Phillips New Now",
              start_at: "2018-06-11T01:00:00+00:00",
            },
            me: { bidders: [], has_credit_cards: false },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Registration (qualified cc on file), live sale starting in future", () => {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: Registration,
          title: "",
          passProps: {
            sale: {
              id: "1",
              live_start_at: "2029-06-11T01:00:00+00:00",
              end_at: null,
              name: "Phillips New Now",
              start_at: "2018-06-11T01:00:00+00:00",
            },
            me: {
              bidders: [],
              has_credit_cards: true,
            },
          },
        }}
        style={{ flex: 1 }}
      />
    )
  })
  .add("Registration Result (pending)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
  })
  .add("Registration Result (complete)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
  })
  .add("Registration Result (error)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
  })
