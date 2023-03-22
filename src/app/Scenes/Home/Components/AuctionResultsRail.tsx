import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { AuctionResultsRail_auctionResults$key } from "__generated__/AuctionResultsRail_auctionResults.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
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
  contextModule: ContextModule
  title: string
}

export const getDetailsByContextModule = (
  contextModule: ContextModule
): { viewAllUrl: string; browseAllButtonText: string } => {
  switch (contextModule) {
    case ContextModule.upcomingAuctionsRail:
      return {
        viewAllUrl: "/upcoming-auction-results",
        browseAllButtonText: "Browse All Auctions",
      }
    case ContextModule.auctionResultsRail:
      return {
        viewAllUrl: "/auction-results-for-artists-you-follow",
        browseAllButtonText: "Browse All Results",
      }
    default:
      throw "Unknown ContextModule"
  }
}

export const AuctionResultsRail: React.FC<AuctionResultsRailProps> = memo(
  ({ contextModule, title, ...restProps }) => {
    const { viewAllUrl, browseAllButtonText } = getDetailsByContextModule(contextModule)
    const { trackEvent } = useTracking()
    const auctionResults = useFragment(meFragment, restProps.auctionResults)

    const { width: screenWidth } = useScreenDimensions()

    const filteredAuctionResults = extractNodes(auctionResults).filter(
      (auctionResult) => auctionResult
    )

    if (!auctionResults || auctionResults?.totalCount === 0) {
      return null
    }

    const handleMorePress = () => {
      trackEvent(tracks.tappedViewAll(contextModule))
      navigate(viewAllUrl)
    }

    return (
      <Flex>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader(contextModule))
              navigate(viewAllUrl)
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
          ListFooterComponent={
            handleMorePress ? (
              <BrowseMoreRailCard onPress={handleMorePress} text={browseAllButtonText} />
            ) : undefined
          }
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
  tappedHeader: (contextModule: ContextModule) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: contextModule,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.upcomingAuctions,
    type: "header",
  }),
  tappedViewAll: (contextModule: ContextModule) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: contextModule,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.upcomingAuctions,
    type: "viewAll",
  }),
}
