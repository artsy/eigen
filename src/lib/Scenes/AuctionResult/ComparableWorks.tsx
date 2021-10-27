import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ComparableWorks_auctionResult } from "__generated__/ComparableWorks_auctionResult.graphql"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ComparableWorks {
  auctionResult: ComparableWorks_auctionResult
}
const ComparableWorks: React.FC<ComparableWorks> = ({ auctionResult }) => {
  const { trackEvent } = useTracking()

  const auctionResultsByFollowedArtists = extractNodes(auctionResult.comparableAuctionResults)

  const hasAuctionResults = auctionResultsByFollowedArtists?.length

  if (!hasAuctionResults) {
    return null
  }

  return (
    <Flex testID="comparableWorks">
      <Text variant="md" my={2}>
        Comparable Works
      </Text>

      <FlatList
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        ItemSeparatorComponent={() => (
          <Flex py={2}>
            <Separator borderColor="black10" />
          </Flex>
        )}
        renderItem={({ item, index }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultFragmentContainer
              showArtistName
              withHorizontalPadding={false}
              auctionResult={item}
              onPress={() => {
                trackEvent(tracks.tapAuctionResult(item.internalID, index))
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
  auctionResult: graphql`
    fragment ComparableWorks_auctionResult on AuctionResult {
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

export const tracks = {
  tapAuctionResult: (auctionResultId: string, index: number) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultComparableWorks, // TODO: Add to Cohesion
    context_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
