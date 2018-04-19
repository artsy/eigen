import { storiesOf } from "@storybook/react-native"
import React from "react"

import BidFlow from "../../../Containers/BidFlow"
import { BidResult } from "../Screens/BidResult"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

import { BidFlowRenderer, SelectMaxBidRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlowRenderer render={renderWithLoadProgress(BidFlow)} saleArtworkID="5aada729139b216c0bf18103" />
  })
  .add("Select Max Bid", () => (
    <SelectMaxBidRenderer render={renderWithLoadProgress(MaxBidScreen)} saleArtworkID="5aada729139b216c0bf18103" />
  ))
  .add("Confirm Bid", () => {
    return <ConfirmBid saleArtworkID="5aada729139b216c0bf18103" bidAmountCents={4500000} />
  })
  .add("Bidding Result (winning)", () => {
    return <BidResult winning />
  })
  .add("Bidding Result (not highest bid)", () => {
    return <BidResult winning={false} />
  })
