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
  { value: 0, count: 1919 },
  { value: 2000, count: 845 },
  { value: 50000, count: 438 },
  { value: 4000, count: 364 },
  { value: 6000, count: 233 },
  { value: 8000, count: 159 },
  { value: 10000, count: 156 },
  { value: 12000, count: 149 },
  { value: 14000, count: 91 },
  { value: 16000, count: 67 },
  { value: 18000, count: 66 },
  { value: 22000, count: 60 },
  { value: 24000, count: 47 },
  { value: 38000, count: 32 },
  { value: 34000, count: 31 },
  { value: 20000, count: 28 },
  { value: 32000, count: 28 },
  { value: 44000, count: 26 },
  { value: 30000, count: 25 },
  { value: 28000, count: 20 },
  { value: 26000, count: 17 },
  { value: 40000, count: 11 },
  { value: 36000, count: 7 },
  { value: 42000, count: 3 },
  { value: 48000, count: 3 },
  { value: 46000, count: 2 },
]
