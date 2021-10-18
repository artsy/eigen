import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ComparableWorks_auctionResult } from "__generated__/ComparableWorks_auctionResult.graphql"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ComparableWorks {
  auctionResult: ComparableWorks_auctionResult
}
const ComparableWorks: React.FC<ComparableWorks> = ({ auctionResult }) => {
  // const { trackEvent } = useTracking()

  // TODO: Add real data
  // const auctionResultsByFollowedArtists = extractNodes(auctionResult?.comparableWorks)
  const auctionResultsByFollowedArtists = extractNodes(MOCK_DATA)

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
  comparableWorks: graphql`
    fragment ComparableWorks_me on AuctionResult {
      comparableWorks(first: 3) {
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

const MOCK_DATA = {
  edges: [
    {
      cursor: "YXJyYXljb25uZWN0aW9uOjE=",
      node: {
        title: "Tristesse Du Roi (The Sadness of the King)",
        priceRealized: {
          display: "$1,211",
          displayUSD: "$1,211",
        },
      },
    },
    {
      cursor: "YXJyYXljb25uZWN0aW9uOjI=",
      node: {
        title: "Végétaux, from Verve, Vol. IX, 35/36",
        priceRealized: {
          display: "$1,083",
          displayUSD: "$1,083",
        },
      },
    },
  ],
}
