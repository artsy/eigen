import { storiesOf } from "@storybook/react-native"
import React from "react"

import { BiddingThemeProvider } from "lib/Components/Bidding/Components/BiddingThemeProvider"
import { Flex } from "lib/Components/Bidding/Elements/Flex"
import { CustomModal } from "../CustomModal"

storiesOf("App Style/CustomModal").add("Modal", () => (
  <BiddingThemeProvider>
    <Flex mt={7} ml={4} mr={4}>
      <CustomModal visible={true} headerText="An error occurred" detailText="Your card's security code is incorrect" />
    </Flex>
  </BiddingThemeProvider>
))
