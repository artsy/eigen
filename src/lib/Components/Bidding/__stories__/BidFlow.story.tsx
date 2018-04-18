import { storiesOf } from "@storybook/react-native"
import React from "react"

import { BidFlow } from "../Screens/BidFlow"
import { ConfirmBid } from "../Screens/ConfirmBid"
import { SelectMaxBid } from "../Screens/SelectMaxBid"

storiesOf("Bidding")
  .add("Show bid flow", () => {
    return <BidFlow saleArtworkID="5aada729139b216c0bf18103" />
  })
  .add("Select Max Bid", () => {
    return <SelectMaxBid saleArtworkID="5aada729139b216c0bf18103" />
  })
  .add("Confirm Bid", () => {
    return <ConfirmBid saleArtworkID="5aada729139b216c0bf18103" bidAmountCents={4500000} />
  })
