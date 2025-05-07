import { Flex, Text } from "@artsy/palette-mobile"
import { MyCollectionInsightsOverview_myCollectionInfo$key } from "__generated__/MyCollectionInsightsOverview_myCollectionInfo.graphql"
import { graphql, useFragment } from "react-relay"

interface MyCollectionInsightsOverviewProps {
  myCollectionInfo: MyCollectionInsightsOverview_myCollectionInfo$key
}

export const MyCollectionInsightsOverview: React.FC<MyCollectionInsightsOverviewProps> = (
  props
) => {
  const myCollectionInfo = useFragment(fragment, props.myCollectionInfo)

  return (
    <Flex p={2} pb={4} flexDirection="row">
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="xs" mb={1}>
          Total Artworks
        </Text>
        <Text color="blue100" variant="lg-display">
          {myCollectionInfo.artworksCount}
        </Text>
      </Flex>
      <Flex flex={1} alignSelf="flex-start">
        <Text variant="xs" mb={1}>
          Total Artists
        </Text>
        <Text color="blue100" variant="lg-display">
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
