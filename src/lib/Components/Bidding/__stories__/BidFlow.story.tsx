import { storiesOf } from "@storybook/react-native"
import React from "react"
import { BidFlow } from "../Screens/BidFlow"

storiesOf("Bidding").add("Show bid flow", () => {
  return <BidFlow />
})
