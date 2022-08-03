import { storiesOf } from "@storybook/react-native"
import React from "react"
import { LineGraph } from "."
import { Flex } from ".."
import { testChartData } from "./testHelpers"

storiesOf("LineGraph", module).add("LineGraph", () => (
  <Flex mx={2} my={2}>
    <LineGraph
      data={testChartData}
      bands={[{ name: "Sculpture" }]}
      onBandSelected={(band) => console.log(`${band} selected`)}
      showHighlights
    />
  </Flex>
))
