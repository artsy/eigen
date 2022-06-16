import { Flex } from "palette"
import React from "react"
import { LineGraphIndex } from "./LineGraphIndex"
import { LineGraphMediumPicker } from "./LineGraphMediumPicker"
import { LineGraphStoreProvider } from "./LineGraphStore"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"

interface Props {
  // Number of lots sold in the entire selected period
  totalLots: number
  // Average auction price in the selected period
  averagePrice: string
}

export const LineGraph: React.FC<Props> = ({ totalLots = 50, averagePrice = "USD $12,586" }) => {
  return (
    <Flex mt={5}>
      <LineGraphStoreProvider
        initialData={{ totalLots, averagePrice, availableMediums: _AVAILABLE_MEDIUMS }}
      >
        <LineGraphIndex />
        <LineGraphMediumPicker />
      </LineGraphStoreProvider>
    </Flex>
  )
}
