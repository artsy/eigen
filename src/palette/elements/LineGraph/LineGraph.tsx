import { Flex } from "palette"
import React from "react"
import { LineGraphIndex } from "./LineGraphIndex"
import { LineGraphStoreProvider } from "./LineGraphStore"

// tslint:disable-next-line:no-empty-interface
interface Props {
  // Number of lots sold in the entire selected period
  totalLots: number
  // Average auction price in the selected period
  averagePrice: string
}

export const LineGraph: React.FC<Props> = ({ totalLots = 50, averagePrice = "USD $12,586" }) => {
  return (
    <LineGraphStoreProvider initialData={{ totalLots, averagePrice }}>
      <Flex>
        <LineGraphIndex />
      </Flex>
    </LineGraphStoreProvider>
  )
}
