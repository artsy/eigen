import { storiesOf } from "@storybook/react-native"
import React from "react"
import BidFlow from "../Screens/BidFlow"

storiesOf("Bidding").add("Show bid flow", () => {
  return <BidFlow saleArtworkID="5aada729139b216c0bf18103" />
})
