import { storiesOf } from "@storybook/react-native"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { BidFlowRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import createEnvironment from "../../../relay/createEnvironment"

import { Flex } from "../Elements/Flex"
import { Serif16 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Checkbox } from "../Components/Checkbox"

import BidFlow from "../../../Containers/BidFlow"
import { BidResult } from "../Screens/BidResult"
import { ConfirmBidScreen } from "../Screens/ConfirmBid"
import { ConfirmFirstTimeBid } from "../Screens/ConfirmFirstTimeBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

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
  .add("Confirm Bid (first time)", () => {
    return (
      <ConfirmFirstTimeBid
        sale_artwork={{
          artwork: {
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
  .add("Bidding Result (winning)", () => {
    return <BidResult winning />
  })
  .add("Bidding Result (not highest bid)", () => {
    return <BidResult winning={false} />
  })

storiesOf("App Style/Input").add("Check Boxes", () => (
  <BiddingThemeProvider>
    <Flex mt={7}>
      <Checkbox pl={3} pb={1}>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} error="Please agree to the terms and conditions">
        <Serif16 mt={2}>Agree to Terms and Conditions</Serif16>
      </Checkbox>

      <Checkbox p={3} checked error="Please agree to the terms and conditions">
        <Serif16 mt={2}>Agree to Terms and Conditions</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} disabled>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked disabled>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>
    </Flex>
  </BiddingThemeProvider>
))
