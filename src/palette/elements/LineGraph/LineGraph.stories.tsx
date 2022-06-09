import { storiesOf } from "@storybook/react-native"
import React from "react"
import { LineGraph } from "."
import { Flex } from ".."

storiesOf("LineGraph", module).add("LineGraph", () => (
  <Flex mx={2} my={2}>
    <LineGraph />
  </Flex>
))
