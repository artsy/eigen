import { Flex, Text } from "palette"
import React from "react"

export const MyCollectionInsightsOverview = () => {
  return (
    <Flex pt={1} flexDirection="row">
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="sm">Total Artworks</Text>
        <Text color="blue100" variant="xl">
          25
        </Text>
      </Flex>
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="sm">Total Artists</Text>
        <Text color="blue100" variant="xl">
          8
        </Text>
      </Flex>
    </Flex>
  )
}
