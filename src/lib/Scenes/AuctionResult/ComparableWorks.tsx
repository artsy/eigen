import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ComparableWorks_comparableAuctionResults } from "__generated__/ComparableWorks_comparableAuctionResults.graphql"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ComparableWorks {
  auctionResult: any
}
const ComparableWorks: React.FC<ComparableWorks> = ({ auctionResult }) => {
  // const { trackEvent } = useTracking()

  const auctionResultsByFollowedArtists = extractNodes(auctionResult.comparableAuctionResults)

  const hasAuctionResults = auctionResultsByFollowedArtists?.length

  if (!hasAuctionResults) {
    return null
  }

  return (
    <Flex>
      <Text variant="md" my={2}>
        Comparable Works
      </Text>

      <FlatList
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        ItemSeparatorComponent={() => (
          <Flex px={2} py={2}>
            <Separator borderColor="black10" />
          </Flex>
        )}
        renderItem={({ item }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultFragmentContainer
              showArtistName
              withHorizontalPadding={false}
              auctionResult={item}
              onPress={() => {
                // trackEvent(tracks.tappedThumbnail(item.internalID, index))
                navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

export const ComparableWorksFragmentContainer = createFragmentContainer(ComparableWorks, {
  comparableAuctionResults: graphql`
    fragment ComparableWorks_comparableAuctionResults on AuctionResult {
      comparableAuctionResults(first: 3) @optionalField {
        totalCount
        edges {
          cursor
          node {
            ...AuctionResultListItem_auctionResult
            artistID
            internalID
          }
        }
      }
    }
  `,
})

// TODO: correct tracking
export const tracks = {
  tapAuctionGroup: (auctionResultId: string) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsForArtistsYouFollow,
    context_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    type: "thumbnail",
  }),
}
