import { Flex, Text } from "palette"
import React from "react"

export const AverageSalePriceAtAucition: React.FC = () => {
  return (
    <Flex mx={2} pt={6}>
      <Text variant="lg" mb={0.5} testID="Average_Auction_Price_title">
        Average Auction Price
      </Text>
      <Text variant="xs">Track price stability or growth for your artists.</Text>
    </Flex>
  )
}
