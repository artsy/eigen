import { bullet, Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistInsights_artist$data } from "__generated__/ArtistInsights_artist.graphql"
import {
  FilterArray,
  filterArtworksParams,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { KeywordFilter } from "app/Components/ArtworkFilter/Filters/KeywordFilter"
import { ORDERED_AUCTION_RESULTS_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useCallback } from "react"
import { useTracking } from "react-tracking"
import { tracks } from "./ArtistInsights"

// Type for auction result nodes extracted from the connection
export type AuctionResultNode = ExtractNodeType<
  ArtistInsights_artist$data["auctionResultsConnection"]
>

// Discriminated union for all list item types
export type ArtistInsightsListItem =
  | { type: "marketSignals" }
  | { type: "auctionResultsHeader" }
  | { type: "sectionTitle"; id: string; title: string; count: number }
  | { type: "auctionResult"; auctionResult: AuctionResultNode }
  | { type: "emptyState" }

// Key extractor for the FlatList
export const keyExtractor = (item: ArtistInsightsListItem, index: number): string => {
  switch (item.type) {
    case "marketSignals":
      return "market-signals"
    case "auctionResultsHeader":
      return "auction-results-header"
    case "sectionTitle":
      return `section-title-${item.id}`
    case "auctionResult":
      return `auction-result-${item.auctionResult.internalID}`
    case "emptyState":
      return "empty-state"
    default:
      return `item-${index}`
  }
}

// Auction Results Header Component
interface AuctionResultsHeaderProps {
  artist: ArtistInsights_artist$data
  appliedFilters: FilterArray
  onScrollToTop: () => void
  keywordFilterRefetching: boolean
  onKeywordFilterTypingStart: () => void
}

export const AuctionResultsHeader: React.FC<AuctionResultsHeaderProps> = ({
  artist,
  appliedFilters,
  onScrollToTop,
  keywordFilterRefetching,
  onKeywordFilterTypingStart,
}) => {
  const tracking = useTracking()
  const filterParams = filterArtworksParams(appliedFilters, "auctionResult")

  const getSortDescription = useCallback(() => {
    const sortMode = ORDERED_AUCTION_RESULTS_SORTS.find(
      (sort) => sort.paramValue === filterParams?.sort
    )
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams])

  const resultsString =
    Number(artist.auctionResultsConnection?.totalCount) === 1 ? "result" : "results"

  return (
    <Flex>
      <Flex flexDirection="row" alignItems="center">
        <InfoButton
          titleElement={
            <Text variant="sm-display" mr={0.5}>
              Auction Results
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tracks.tapAuctionResultsInfo())
          }}
          modalTitle="Auction Results"
          modalContent={<AuctionResultsInfoModal />}
        />
      </Flex>
      <Text variant="xs" color="mono60">
        {!!artist.auctionResultsConnection?.totalCount
          ? new Intl.NumberFormat().format(artist.auctionResultsConnection.totalCount)
          : 0}{" "}
        {resultsString} {bullet} Sorted by {getSortDescription()?.toLowerCase()}
      </Text>
      <Separator mt={2} />
      <KeywordFilter
        artistId={artist.internalID}
        artistSlug={artist.slug}
        loading={keywordFilterRefetching}
        onFocus={onScrollToTop}
        onTypingStart={onKeywordFilterTypingStart}
      />
    </Flex>
  )
}

const AuctionResultsInfoModal = () => (
  <>
    <Text>
      These auction results bring together sale data from top auction houses around the world,
      including Christie's, Sotheby's, Phillips and Bonhams. Results are updated daily.
    </Text>
    <Spacer y={2} />
    <Text>
      Please note that the sale price includes the hammer price and buyer's premium, as well as any
      other additional fees (e.g., Artist's Resale Rights).
    </Text>
  </>
)

// Section Title Component
interface AuctionResultsSectionTitleProps {
  title: string
  count: number
}

export const AuctionResultsSectionTitle: React.FC<AuctionResultsSectionTitleProps> = ({
  title,
  count,
}) => {
  return (
    <Flex px={2} my={2}>
      <Text variant="sm-display">{title}</Text>
      <Text variant="xs" color="mono60">
        {count} result{count > 1 ? "s" : ""}
      </Text>
    </Flex>
  )
}
