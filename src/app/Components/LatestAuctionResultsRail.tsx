import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { LatestAuctionResultsRail_me$key } from "__generated__/LatestAuctionResultsRail_me.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { AUCTION_RESULT_CARD_WIDTH } from "app/Scenes/HomeView/Sections/HomeViewSectionAuctionResults"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  me: LatestAuctionResultsRail_me$key | null | undefined
}

export const LatestAuctionResultsRail: React.FC<Props> = ({ me }) => {
  const { trackEvent } = useTracking()

  const data = useFragment(latestAuctionResultsRailFragment, me)
  const auctionResultsByFollowedArtists = extractNodes(data?.auctionResultsByFollowedArtists)

  if (!auctionResultsByFollowedArtists?.length) {
    return null
  }

  const href = "/auction-results-for-artists-you-follow"

  return (
    <Flex>
      <SectionTitle
        href={href}
        title="Latest Auction Results"
        mx={2}
        onPress={() => trackEvent(tracks.tappedHeader())}
      />

      <CardRailFlatList
        data={auctionResultsByFollowedArtists}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        renderItem={({ item, index }) => {
          return (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              width={AUCTION_RESULT_CARD_WIDTH}
              withHorizontalPadding={false}
              onPress={() => {
                trackEvent(tracks.tappedThumbnail(item.internalID, index))
              }}
            />
          )
        }}
        ListFooterComponent={
          <BrowseMoreRailCard
            href={href}
            onPress={() => {
              trackEvent(tracks.tappedAuctionResultGroupViewAll())
            }}
            text="Browse All Results"
          />
        }
      />
    </Flex>
  )
}

const latestAuctionResultsRailFragment = graphql`
  fragment LatestAuctionResultsRail_me on Me {
    auctionResultsByFollowedArtists(first: 10, state: PAST) {
      edges {
        node {
          ...AuctionResultListItem_auctionResult
          artistID
          internalID
        }
      }
    }
  }
`

export const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsForArtistsYouFollow,
    context_screen_owner_type: OwnerType.sale,
    destination_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    type: "header",
  }),

  tappedThumbnail: (auctionResultId: string, position: number) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsForArtistsYouFollow,
    context_screen_owner_type: OwnerType.sale,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    horizontal_slide_position: position,
    type: "thumbnail",
  }),

  tappedAuctionResultGroupViewAll: () => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsForArtistsYouFollow,
    context_screen_owner_type: OwnerType.sale,
    destination_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    type: "viewAll",
  }),
}
