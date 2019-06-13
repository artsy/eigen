import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { BidFlowRenderer, RegistrationFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import createEnvironment from "../../../relay/createEnvironment"

import { BidFlowSelectMaxBidRendererQuery } from "__generated__/BidFlowSelectMaxBidRendererQuery.graphql"
import NavigatorIOS from "react-native-navigator-ios"
import BidFlow from "../../../Containers/BidFlow"
import RegistrationFlow from "../../../Containers/RegistrationFlow"
import { BillingAddress } from "../Screens/BillingAddress"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { Registration } from "../Screens/Registration"
import { RegistrationResult, RegistrationStatus } from "../Screens/RegistrationResult"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

const testSaleArtworkID = "5ce8ddf9b8ca7812a17b221b"
const testArtworkID = "5ce8ddf899e7e26cd3715136"
const testSaleID = "capsule-gallery-auction-modern-post-war-and-contemporary-art"

const BidFlowMaxBidStoryRenderer: React.SFC<any> = ({ saleArtworkID }) => (
  <QueryRenderer<BidFlowSelectMaxBidRendererQuery>
    environment={createEnvironment() as any}
    query={graphql`
      query BidFlowSelectMaxBidRendererQuery($saleArtworkID: String!) {
        sale_artwork(id: $saleArtworkID) {
          ...SelectMaxBid_sale_artwork
        }
      }
    `}
    variables={{ saleArtworkID }}
    render={renderWithLoadProgress(MaxBidScreen)}
  />
)

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlowRenderer render={renderWithLoadProgress(BidFlow)} artworkID={testArtworkID} saleID={testSaleID} />
  })
  .add("Select Max Bid", () => <BidFlowMaxBidStoryRenderer saleArtworkID={testSaleArtworkID} />)
  .add("Confirm Bid (registered)", () => {
    return (
      <ConfirmBid
        sale_artwork={
          {
            internalID: "saleartwork12345",
            sale: { id: "sale-id", live_start_at: "2018-08-13T18:00:00+00:00", end_at: null },
            artwork: { id: "artwork-id", title: "Morgan Hill (Prototype)", date: "1973", artist_names: "Lewis balts" },
            lot_label: "2",
          } as any
        }
        me={{ has_qualified_credit_cards: false, bidders: [{ qualified_for_bidding: true }] } as any}
        increments={[{ display: "$45,000", cents: 4500000 }]}
        selectedBidIndex={0}
      />
    )
  })

  .add("Confirm Bid (no artwork date)", () => {
    return (
      <ConfirmBid
        sale_artwork={
          {
            internalID: "saleartwork12345",
            sale: { id: "sale-id", live_start_at: "2018-08-11T01:00:00+00:00", end_at: null },
            artwork: { id: "artwork-id", title: "Morgan Hill (Prototype)", date: null, artist_names: "Lewis balts" },
            lot_label: "2",
          } as any
        }
        me={{ has_qualified_credit_cards: false, bidders: [{ qualified_for_bidding: true }] } as any}
        increments={[{ display: "$45,000", cents: 4500000 }]}
        selectedBidIndex={0}
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
            increments: [{ display: "$45,000", cents: 4500000 }],
            selectedBidIndex: 0,
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
            increments: [{ display: "$45,000", cents: 4500000 }],
            selectedBidIndex: 0,
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
              name: "Phillips New Now: Prints & Multiples from the estate of the esteemed Yuki Stockmeier",
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
