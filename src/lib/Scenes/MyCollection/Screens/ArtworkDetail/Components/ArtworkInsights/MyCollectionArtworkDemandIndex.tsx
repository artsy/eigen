import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkDemandIndexProps {}

const MyCollectionArtworkDemandIndex: React.FC<MyCollectionArtworkDemandIndexProps> = (props) => {
  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Demand index
        </Text>
        <InfoCircleIcon />
      </Flex>
      <Box>
        <Text variant="largeTitle" color="purple100">
          8.23
        </Text>
      </Box>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text>0.0</Text>
        <Text>Progress bar..</Text>
        <Text>10.0</Text>
      </Flex>

      <Spacer my={1} />

      <Box>
        <Text>Strong demand (6.0–8.5)</Text>
        <Text color="black60">
          Demand is higher than the supply available in the market and sale price exceeds estimates.
        </Text>
      </Box>
    </ScreenMargin>
  )
}

export const MyCollectionArtworkDemandIndexFragmentContainer = createFragmentContainer(MyCollectionArtworkDemandIndex, {
  artwork: graphql`
    fragment MyCollectionArtworkDemandIndex_artwork on Artwork {
      id
    }
  `,
})
