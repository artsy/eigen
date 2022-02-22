import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { ArtistInsightsAuctionResults_artist } from "__generated__/ArtistInsightsAuctionResults_artist.graphql"
import {
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_AUCTION_RESULTS_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { PAGE_SIZE } from "app/Components/constants"
import Spinner from "app/Components/Spinner"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { debounce } from "lodash"
import { Box, bullet, Flex, Separator, Spacer, Text, useColor } from "palette"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { useScreenDimensions } from "../../../utils/useScreenDimensions"
import { DEBOUNCE_DELAY, KeywordFilter } from "../../ArtworkFilter/Filters/KeywordFilter"
import { AuctionResultListItemFragmentContainer } from "../../Lists/AuctionResultListItem"

interface Props {
  artist: ArtistInsightsAuctionResults_artist
  relay: RelayPaginationProp
  scrollToTop: () => void
}

const ArtistInsightsAuctionResults: React.FC<Props> = ({ artist, relay, scrollToTop }) => {
  const color = useColor()
  const tracking = useTracking()

  const auctionResults = extractNodes(artist.auctionResultsConnection)

  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFilterTypeAction
  )
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterParams = filterArtworksParams(appliedFilters, "auctionResult")

  const keywordFilterValue = appliedFilters?.find(
    (filter) => filter.paramName === FilterParamName.keyword
  )?.paramValue
  const isKeywordFilterActive = !!keywordFilterValue

  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const [keywordFilterRefetching, setKeywordFilterRefetching] = useState(false)

  const endKeywordFilterRefetching = useMemo(
    () => debounce(() => setKeywordFilterRefetching(false), DEBOUNCE_DELAY),
    []
  )

  // We are using the same logic used in Force but it might be useful
  // to adjust metaphysics to support aggregations like other filters in the app
  const aggregations = [
    {
      slice: "earliestCreatedYear",
      counts: [
        {
          value: artist.auctionResultsConnection?.createdYearRange?.startAt || artist.birthday,
          name: "earliestCreatedYear",
        },
      ],
    },
    {
      slice: "latestCreatedYear",
      counts: [
        {
          value:
            artist.auctionResultsConnection?.createdYearRange?.endAt || new Date().getFullYear(),
          name: "latestCreatedYear",
        },
      ],
    },
  ]

  useArtworkFilters({
    relay,
    aggregations,
    componentPath: "ArtistInsights/ArtistAuctionResults",
    refetchVariables: filterParams,
    onApply: () => scrollToTop(),
    onRefetch: () => endKeywordFilterRefetching(),
  })

  useEffect(() => {
    setFilterTypeAction("auctionResult")
  }, [])

  const getSortDescription = useCallback(() => {
    const sortMode = ORDERED_AUCTION_RESULTS_SORTS.find(
      (sort) => sort.paramValue === filterParams?.sort
    )
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams])

  const loadMoreAuctionResults = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setLoadingMoreData(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  const renderAuctionResultsModal = () => (
    <>
      <Spacer my={1} />
      <Text>
        These auction results bring together sale data from top auction houses around the world,
        including Christie’s, Sotheby’s, Phillips and Bonhams. Results are updated daily.
      </Text>
      <Spacer mb={2} />
      <Text>
        Please note that the sale price includes the hammer price and buyer’s premium, as well as
        any other additional fees (e.g., Artist’s Resale Rights).
      </Text>
      <Spacer mb={2} />
    </>
  )

  const resultsString =
    Number(artist.auctionResultsConnection?.totalCount) === 1 ? "result" : "results"

  return (
    <View
      // Setting min height to keep scroll position when user searches with the keyword filter.
      style={{ minHeight: useScreenDimensions().height }}
    >
      <Flex>
        <Flex flexDirection="row" alignItems="center">
          <InfoButton
            titleElement={
              <Text variant="md" mr={0.5}>
                Auction Results
              </Text>
            }
            trackEvent={() => {
              tracking.trackEvent(tracks.tapAuctionResultsInfo())
            }}
            modalTitle="Auction Results"
            maxModalHeight={310}
            modalContent={renderAuctionResultsModal()}
          />
        </Flex>
        <SortMode variant="xs" color="black60">
          {!!artist.auctionResultsConnection?.totalCount
            ? new Intl.NumberFormat().format(artist.auctionResultsConnection.totalCount)
            : 0}{" "}
          {resultsString} {bullet} Sorted by {getSortDescription()?.toLowerCase()}
        </SortMode>
        <Separator mt="2" />
        <KeywordFilter
          artistId={artist.internalID}
          artistSlug={artist.slug}
          loading={keywordFilterRefetching}
          onFocus={scrollToTop}
          onTypingStart={() => setKeywordFilterRefetching(true)}
        />
      </Flex>
      {auctionResults.length ? (
        <Flex py={2}>
          <FlatList
            data={auctionResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AuctionResultListItemFragmentContainer
                auctionResult={item}
                onPress={() => {
                  tracking.trackEvent(tracks.tapAuctionGroup(item.internalID, artist.internalID))
                  navigate(`/artist/${artist?.slug!}/auction-result/${item.internalID}`)
                }}
              />
            )}
            ItemSeparatorComponent={() => (
              <Flex px={2}>
                <Separator borderColor={color("black10")} />
              </Flex>
            )}
            style={{ width: useScreenDimensions().width, left: -20 }}
            onEndReached={loadMoreAuctionResults}
            ListFooterComponent={
              loadingMoreData ? (
                <Flex my={4}>
                  <Spinner />
                </Flex>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </Flex>
      ) : (
        <Box my="80px">
          <FilteredArtworkGridZeroState
            id={artist.id}
            slug={artist.slug}
            hideClearButton={isKeywordFilterActive}
          />
        </Box>
      )}
    </View>
  )
}

export const SortMode = styled(Text)``

export const ArtistInsightsAuctionResultsPaginationContainer = createPaginationContainer(
  ArtistInsightsAuctionResults,
  {
    artist: graphql`
      fragment ArtistInsightsAuctionResults_artist on Artist
      @argumentDefinitions(
        allowEmptyCreatedDates: { type: "Boolean", defaultValue: true }
        categories: { type: "[String]" }
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        earliestCreatedYear: { type: "Int", defaultValue: 1000 }
        keyword: { type: "String" }
        latestCreatedYear: { type: "Int", defaultValue: 2050 }
        organizations: { type: "[String]" }
        sizes: { type: "[ArtworkSizes]" }
        sort: { type: "AuctionResultSorts", defaultValue: DATE_DESC }
      ) {
        birthday
        slug
        id
        internalID
        auctionResultsConnection(
          after: $cursor
          allowEmptyCreatedDates: $allowEmptyCreatedDates
          categories: $categories
          earliestCreatedYear: $earliestCreatedYear
          first: $count
          keyword: $keyword
          latestCreatedYear: $latestCreatedYear
          organizations: $organizations
          sizes: $sizes
          sort: $sort
        ) @connection(key: "artist_auctionResultsConnection") {
          createdYearRange {
            startAt
            endAt
          }
          totalCount
          edges {
            node {
              id
              internalID
              ...AuctionResultListItem_auctionResult
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.artist.auctionResultsConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query ArtistInsightsAuctionResultsQuery(
        $allowEmptyCreatedDates: Boolean
        $artistID: String!
        $categories: [String]
        $count: Int!
        $cursor: String
        $earliestCreatedYear: Int
        $keyword: String
        $latestCreatedYear: Int
        $organizations: [String]
        $sizes: [ArtworkSizes]
        $sort: AuctionResultSorts
      ) {
        artist(id: $artistID) {
          ...ArtistInsightsAuctionResults_artist
            @arguments(
              allowEmptyCreatedDates: $allowEmptyCreatedDates
              categories: $categories
              count: $count
              cursor: $cursor
              earliestCreatedYear: $earliestCreatedYear
              keyword: $keyword
              latestCreatedYear: $latestCreatedYear
              organizations: $organizations
              sizes: $sizes
              sort: $sort
            )
        }
      }
    `,
  }
)

export const tracks = {
  tapAuctionGroup: (auctionId: string, artistId: string) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionId,
    type: "thumbnail",
  }),

  tapAuctionResultsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.artistAuctionResults,
    subject: "auctionResults",
  }),
}
