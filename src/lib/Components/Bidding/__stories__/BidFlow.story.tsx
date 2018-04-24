import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../../relay/createEnvironment"

import BidFlow from "../../../Containers/BidFlow"
import { BidResult } from "../Screens/BidResult"
import { ConfirmBidScreen } from "../Screens/ConfirmBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

import { BidFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

const SelectMaxBidRenderer: React.SFC<any> = ({ render, saleArtworkID }) => {
  return (
    <QueryRenderer
      environment={createEnvironment()}
      query={graphql`
        query BidFlowSelectMaxBidRendererQuery($saleArtworkID: String!) {
          sale_artwork(id: $saleArtworkID) {
            ...SelectMaxBid_sale_artwork
          }
        }
      `}
      variables={{
        saleArtworkID,
      }}
      render={render}
    />
  )
}

const ConfirmBidScreenRenderer: React.SFC<any> = ({ render, saleArtworkID }) => {
  return (
    <QueryRenderer
      environment={createEnvironment()}
      query={graphql`
        query BidFlowConfirmBidScreenRendererQuery($saleArtworkID: String!) {
          sale_artwork(id: $saleArtworkID) {
            ...ConfirmBid_sale_artwork
          }
        }
      `}
      variables={{ saleArtworkID }}
      render={render}
    />
  )
}

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlowRenderer render={renderWithLoadProgress(BidFlow)} saleArtworkID="5aada729139b216c0bf18103" />
  })
  .add("Select Max Bid", () => (
    <SelectMaxBidRenderer render={renderWithLoadProgress(MaxBidScreen)} saleArtworkID="5aada729139b216c0bf18103" />
  ))
  .add("Confirm Bid", () => {
    return (
      <ConfirmBidScreenRenderer
        render={renderWithLoadProgress(ConfirmBidScreen, { bid: { display: "$20,000", cents: 2000000 } })}
        saleArtworkID="5aada729139b216c0bf18103"
      />
    )
  })
  .add("Bidding Result (winning)", () => {
    return <BidResult winning />
  })
  .add("Bidding Result (not highest bid)", () => {
    return <BidResult winning={false} />
  })
