import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ComparableWorks_auctionResult$data } from "__generated__/ComparableWorks_auctionResult.graphql"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ComparableWorks {
  auctionResult: ComparableWorks_auctionResult$data
}
const ComparableWorks: React.FC<ComparableWorks> = ({ auctionResult }) => {
  const { trackEvent } = useTracking()

  const comparableAuctionResults = extractNodes(auctionResult.comparableAuctionResults)

  const auctionResults = compact(comparableAuctionResults)

  return (
    <Flex testID="comparableWorks">
      <FlatList
        data={auctionResults}
        listKey="comparable-works"
        keyExtractor={(item, index) => String(item?.internalID || index)}
        initialNumToRender={3}
        ListHeaderComponent={
          <Text variant="md" my={2}>
            Comparable Works
          </Text>
        }
        ItemSeparatorComponent={AuctionResultListSeparator}
        renderItem={({ item, index }) => {
          return (
            <AuctionResultListItemFragmentContainer
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
        ListEmptyComponent={<Text color="black60">No comparable works</Text>}
      />
    </Flex>
  )
}

export const ComparableWorksFragmentContainer = createFragmentContainer(ComparableWorks, {
  auctionResult: graphql`
    fragment ComparableWorks_auctionResult on AuctionResult {
      comparableAuctionResults(first: 3) @optionalField {
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
    context_module: ContextModule.auctionResultComparableWorks,
    context_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
