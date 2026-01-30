import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { AuctionResultsForArtistsYouCollectRail_me$key } from "__generated__/AuctionResultsForArtistsYouCollectRail_me.graphql"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface AuctionResultsForArtistsYouCollectRailProps {
  me: AuctionResultsForArtistsYouCollectRail_me$key
}

export const AuctionResultsForArtistsYouCollectRail: React.FC<
  AuctionResultsForArtistsYouCollectRailProps
> = ({ me }) => {
  const { trackEvent } = useTracking()

  const fragmentData = useFragment(auctionResultsForArtistsYouCollectRailFragment, me)
  const auctionResultsData = extractNodes(fragmentData.myCollectionAuctionResults)

  const { width } = useScreenDimensions()

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
        mb={2}
      />
      <FlatList
        data={auctionResultsData}
        nestedScrollEnabled={false}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AuctionResultListItemFragmentContainer
            auctionResult={item}
            showArtistName
            onPress={() => {
              trackEvent(tracks.tappedAuctionResultGroup(index))
            }}
          />
        )}
        ItemSeparatorComponent={AuctionResultListSeparator}
        style={{ width, left: -20 }}
      />
    </Flex>
  )
}

const auctionResultsForArtistsYouCollectRailFragment = graphql`
  fragment AuctionResultsForArtistsYouCollectRail_me on Me {
    myCollectionAuctionResults(first: 3, state: PAST) {
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
