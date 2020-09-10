import { BorderBox, Box, Join, Sans, Spacer } from "palette"
import React from "react"
import { Text } from "react-native"
import { Field } from "./Field"

export const Insights: React.FC = () => {
  return (
    <Join separator={<Spacer my={1} />}>
      <BorderBox height={100} bg="#ccc">
        <Text>Price / Demand graphs / charts</Text>
      </BorderBox>

      <BorderBox>
        <Sans size="3">Strong demand</Sans>
        <Sans size="3" color="black60">
          Demand is much higher than the supply available in the market and sale price exceeds estimates.
        </Sans>
      </BorderBox>

      <Box>
        <Field label="Avg. Annual Value Sold" value="$5,346,000" />
        <Field label="Avg. Annual Lots Sold" value="25 - 50" />
        <Field label="Sell-through Rate" value="94.5%" />
        <Field label="Median Sale Price to Estimate" value="1.70x" />
        <Field label="Liquidity" value="Very high" />
        <Field label="1-Year Trend" value="Flat" />
      </Box>
    </Join>
  )
}
