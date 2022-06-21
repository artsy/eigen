import { MyCollectionInsightsOverview_myCollectionInfo$key } from "__generated__/MyCollectionInsightsOverview_myCollectionInfo.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionInsightsOverviewProps {
  myCollectionInfo: MyCollectionInsightsOverview_myCollectionInfo$key
}

export const MyCollectionInsightsOverview: React.FC<MyCollectionInsightsOverviewProps> = (
  props
) => {
  const myCollectionInfo = useFragment(fragment, props.myCollectionInfo)

  return (
    <Flex pt={2} px={2} pb={3} flexDirection="row">
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="sm" mb={1}>
          Total Artworks
        </Text>
        <Text color="blue100" variant="xl">
          {myCollectionInfo.artworksCount}
        </Text>
      </Flex>
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="sm" mb={1}>
          Total Artists
        </Text>
        <Text color="blue100" variant="xl">
          {myCollectionInfo.artistsCount}
        </Text>
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment MyCollectionInsightsOverview_myCollectionInfo on MyCollectionInfo {
    artworksCount
    artistsCount
  }
`
