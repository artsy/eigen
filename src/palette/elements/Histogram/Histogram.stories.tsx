import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { Histogram, HistogramBarEntity } from "."
import { Flex } from ".."

storiesOf("Histogram", module)
  .addDecorator(withTheme)
  .add("Simple Histogram", () => (
    <Flex mx={2} my={2}>
      <Histogram selectedRange={[0, 50000]} bars={BAR_DUMMY_DATA} />
    </Flex>
  ))

const BAR_DUMMY_DATA: HistogramBarEntity[] = [
  {
    count: 34548,
    value: 0,
  },
  {
    count: 35234,
    value: 2000,
  },
  {
    count: 6153,
    value: 4000,
  },
  {
    count: 32119,
    value: 6000,
  },
  {
    count: 37462,
    value: 8000,
  },
  {
    count: 1655,
    value: 10000,
  },
  {
    count: 39325,
    value: 12000,
  },
  {
    count: 2926,
    value: 14000,
  },
  {
    count: 9501,
    value: 16000,
  },
  {
    count: 48407,
    value: 18000,
  },
  {
    count: 28957,
    value: 20000,
  },
  {
    count: 24314,
    value: 22000,
  },
  {
    count: 16478,
    value: 24000,
  },
  {
    count: 28169,
    value: 26000,
  },
  {
    count: 7767,
    value: 28000,
  },
  {
    count: 23397,
    value: 30000,
  },
  {
    count: 6444,
    value: 32000,
  },
  {
    count: 18366,
    value: 34000,
  },
  {
    count: 457,
    value: 36000,
  },
  {
    count: 28344,
    value: 38000,
  },
  {
    count: 35116,
    value: 40000,
  },
  {
    count: 13476,
    value: 42000,
  },
  {
    count: 39976,
    value: 44000,
  },
  {
    count: 16281,
    value: 46000,
  },
  {
    count: 38268,
    value: 48000,
  },
  {
    count: 20844,
    value: 50000,
  },
]
