import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Divider } from "../Divider"
import { Timer } from "../Timer"

import moment from "moment"

const fewSecondsFromNow = moment()
  .add(3, "seconds")
  .toISOString()

const fewMoreSecondsFromNow = moment()
  .add(8, "seconds")
  .toISOString()

storiesOf("Bidding").add("Auction Timer", () => (
  <BiddingThemeProvider>
    <Flex mt={7} ml={4} mr={4}>
      <Timer endsAt={fewSecondsFromNow} />
      <Divider mt={5} mb={5} />
      <Timer isPreview={false} isClosed={false} liveStartsAt={fewSecondsFromNow} />
      <Divider mt={5} mb={5} />
      <Timer isPreview={true} startsAt={fewSecondsFromNow} endsAt={fewMoreSecondsFromNow} />
      <Divider mt={5} mb={5} />
      <Timer isPreview={true} startsAt={fewSecondsFromNow} liveStartsAt={fewMoreSecondsFromNow} />
    </Flex>
  </BiddingThemeProvider>
))
