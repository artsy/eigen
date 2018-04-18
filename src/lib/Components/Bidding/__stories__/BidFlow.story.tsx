import { storiesOf } from "@storybook/react-native"
import React from "react"

import BidFlow from "../Screens/BidFlow"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

import { SelectMaxBidRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlow saleArtworkID="5aada729139b216c0bf18103" />
  })
  .add("Select Max Bid", () => (
    <SelectMaxBidRenderer render={renderWithLoadProgress(MaxBidScreen)} saleArtworkID="5aada729139b216c0bf18103" />
  ))
  .add("Confirm Bid", () => {
    return <ConfirmBid saleArtworkID="5aada729139b216c0bf18103" bidAmountCents={4500000} />
  })
