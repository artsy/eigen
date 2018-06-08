import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { Sans12, Serif14, Serif16 } from "../../Elements/Typography"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Input } from "../Input"

storiesOf("App Style/Input").add("Text Input", () => (
  <BiddingThemeProvider>
    <Flex mt={7} ml={4} mr={4}>
      <Serif16 mb={2}>Title</Serif16>
      <Input placeholder="Placeholder" mb={5} />

      <Serif16>Title</Serif16>
      <Serif14 mb={2} color="black60">
        Short description
      </Serif14>
      <Input placeholder="Placeholder" value="Content" mb={5} />

      <Input placeholder="Without Title" mb={5} />

      <Serif16 mb={2}>Error</Serif16>
      <Input error placeholder="Placeholder" mb={3} />
      <Sans12 color="red100">Error message</Sans12>
    </Flex>
  </BiddingThemeProvider>
))
