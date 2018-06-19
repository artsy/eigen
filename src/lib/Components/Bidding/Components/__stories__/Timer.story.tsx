import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Divider } from "../Divider"
import { Timer } from "../Timer"

storiesOf("Bidding").add("Auction Timer", () => (
  <BiddingThemeProvider>
    <Flex mt={7} ml={4} mr={4}>
      <Timer endsAt="2018-05-10T20:22:42+00:00" />
      <Divider mt={5} mb={5} />
      <Timer liveStartsAt="2018-05-10T20:22:42+00:00" />
      <Divider mt={5} mb={5} />
      <Timer isPreview={true} startsAt="2018-05-10T20:22:42+00:00" />
    </Flex>
  </BiddingThemeProvider>
))
