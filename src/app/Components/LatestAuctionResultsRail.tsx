import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { LatestAuctionResultsRail_me$key } from "__generated__/LatestAuctionResultsRail_me.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { AUCTION_RESULT_CARD_WIDTH } from "app/Scenes/HomeView/Sections/HomeViewSectionAuctionResults"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { navigate } from "app/system/navigation/navigate"
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

  const href = "/auction-results-for-artists-you-follow"

  const navigateToAuctionResultsForArtistsYouFollow = () => {
    trackEvent(tracks.tappedHeader())
    navigate(href)
  }

  if (!auctionResultsByFollowedArtists?.length) {
    return null
  }

  return (
    <Flex>
      <SectionTitle
        href={href}
        title="Latest Auction Results"
        mx={2}
        onPress={navigateToAuctionResultsForArtistsYouFollow}
      />

      <CardRailFlatList
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={AuctionResultListSeparator}
        renderItem={({ item, index }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              width={AUCTION_RESULT_CARD_WIDTH}
              onPress={() => {
                trackEvent(tracks.tappedThumbnail(item.internalID, index))
                navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
              }}
            />
          )
        }}
        ListFooterComponent={
          <BrowseMoreRailCard
            onPress={() => navigate("/auction-results-for-artists-you-follow")}
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
`

export const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    type: "header",
  }),

  tappedThumbnail: (auctionResultId: string, position: number) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    horizontal_slide_position: position,
    type: "thumbnail",
  }),
}
