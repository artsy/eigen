import { storiesOf } from "@storybook/react-native"
import React from "react"
import { LineGraph } from "."
import { Flex } from ".."

storiesOf("LineGraph", module).add("LineGraph", () => (
  <Flex mx={2} my={2}>
    <LineGraph totalLots={50} averagePrice="USD $12,586" />
  </Flex>
))
