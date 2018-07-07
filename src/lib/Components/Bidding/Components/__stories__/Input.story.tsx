import { Sans, Serif } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Input } from "../Input"

storiesOf("App Style/Input").add("Text Input", () => (
  <BiddingThemeProvider>
    <Flex mt={7} ml={4} mr={4}>
      <Serif size="3" mb={2}>
        Title
      </Serif>
      <Input placeholder="Placeholder" mb={5} />

      <Serif size="3">Title</Serif>
      <Serif size="2" mb={2} color="black60">
        Short description
      </Serif>
      <Input placeholder="Placeholder" value="Content" mb={5} />

      <Input placeholder="Without Title" mb={5} />

      <Serif size="3" mb={2}>
        Error
      </Serif>
      <Input error placeholder="Placeholder" mb={3} />
      <Sans size="2" color="red100">
        Error message
      </Sans>
    </Flex>
  </BiddingThemeProvider>
))
