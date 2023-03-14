import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { AuctionResultsRail_auctionResults$key } from "__generated__/AuctionResultsRail_auctionResults.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { memo } from "react"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"

interface AuctionResultsRailProps {
  auctionResults: AuctionResultsRail_auctionResults$key
  title: string
}

const getViewAllUrl = (title: string) => {
  switch (title) {
    case "Upcoming Auctions By Artists You Follow":
      return "/upcoming-auction-results"
    case "Latest Auction Results":
      return "/auction-results-for-artists-you-follow"
    default:
      throw "Unknown title for AuctionResultsRail: " + title
  }
}

export const AuctionResultsRail: React.FC<AuctionResultsRailProps> = memo(
  ({ title, ...restProps }) => {
    const { trackEvent } = useTracking()
    const auctionResults = useFragment(meFragment, restProps.auctionResults)

    const { width: screenWidth } = useScreenDimensions()

    const filteredAuctionResults = extractNodes(auctionResults).filter(
      (auctionResult) => auctionResult
    )

    if (!auctionResults || auctionResults?.totalCount === 0) {
      return null
    }

    return (
      <Flex>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader())
              navigate(getViewAllUrl(title))
            }}
          />
        </Flex>
        <FlatList
          horizontal
          data={filteredAuctionResults}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={3}
          renderItem={({ item }) => (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              width={screenWidth * 0.9}
            />
          )}
        />
      </Flex>
    )
  }
)

const meFragment = graphql`
  fragment AuctionResultsRail_auctionResults on AuctionResultConnection {
    totalCount
    edges {
      node {
        ...AuctionResultListItem_auctionResult
        internalID
      }
    }
  }
`

const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.upcomingAuctionsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.upcomingAuctions,
    type: "header",
  }),
}
