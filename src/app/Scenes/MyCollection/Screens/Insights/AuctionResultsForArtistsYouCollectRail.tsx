import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { AuctionResultsForArtistsYouCollectRail_me$key } from "__generated__/AuctionResultsForArtistsYouCollectRail_me.graphql"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Flex } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"

interface AuctionResultsForArtistsYouCollectRailProps {
  me: AuctionResultsForArtistsYouCollectRail_me$key
}

export const AuctionResultsForArtistsYouCollectRail: React.FC<
  AuctionResultsForArtistsYouCollectRailProps
> = ({ me }) => {
  const { trackEvent } = useTracking()

  const fragmentData = useFragment(auctionResultsForArtistsYouCollectRailFragment, me)
  const auctionResultsData = extractNodes(fragmentData.myCollectionAuctionResults)

  if (!auctionResultsData.length) {
    return null
  }

  return (
    <Flex mb={4} px={2}>
      <SectionTitle
        capitalized={false}
        title="Recently Sold at Auction"
        onPress={() => {
          navigate("/auction-results-for-artists-you-collect")
        }}
        mb={1}
      />
      <FlatList
        data={auctionResultsData}
        listKey="artist-auction-results"
        renderItem={({ item, index }) => (
          <AuctionResultListItemFragmentContainer
            auctionResult={item}
            showArtistName
            onPress={() => {
              trackEvent(tracks.tappedAuctionResultGroup(index))
              navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
            }}
          />
        )}
        ItemSeparatorComponent={AuctionResultListSeparator}
        style={{ width: useScreenDimensions().width, left: -20 }}
      />
    </Flex>
  )
}

const auctionResultsForArtistsYouCollectRailFragment = graphql`
  fragment AuctionResultsForArtistsYouCollectRail_me on Me {
    myCollectionAuctionResults(first: 3) {
      totalCount
      edges {
        node {
          ...AuctionResultListItem_auctionResult
          id
          internalID
          artistID
        }
      }
    }
  }
`

const tracks = {
  tappedAuctionResultGroup: (index: number) => ({
    context_screen: Schema.PageNames.MyCollectionInsights,
    context_screen_owner_type: OwnerType.myCollectionInsights,
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.myCollectionMarketSignals,
    destination_screen_owner_type: OwnerType.auctionResult,
    position: index,
  }),
}
