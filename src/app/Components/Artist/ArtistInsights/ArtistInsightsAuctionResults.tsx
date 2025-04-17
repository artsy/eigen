import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { Box, bullet, Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistInsightsAuctionResults_artist$data } from "__generated__/ArtistInsightsAuctionResults_artist.graphql"
import { ArtistInsightsEmpty } from "app/Components/Artist/ArtistInsights/ArtistsInsightsEmpty"
import {
  FilterArray,
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEBOUNCE_DELAY, KeywordFilter } from "app/Components/ArtworkFilter/Filters/KeywordFilter"
import { ORDERED_AUCTION_RESULTS_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import Spinner from "app/Components/Spinner"
import { PAGE_SIZE } from "app/Components/constants"
import { AuctionResultsState } from "app/Scenes/AuctionResults/AuctionResultsScreenWrapper"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { debounce } from "lodash"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  View,
} from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  artist: ArtistInsightsAuctionResults_artist$data
  relay: RelayPaginationProp
  scrollToTop: () => void
  initialFilters?: FilterArray
  onLayout?: (event: LayoutChangeEvent) => void
  onScrollEndDragChange: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
}

const ArtistInsightsAuctionResults: React.FC<Props> = ({
  artist,
  relay,
  scrollToTop,
  initialFilters,
  onLayout,
  onScrollEndDragChange,
}) => {
  const tracking = useTracking()
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()

  const auctionResults = extractNodes(artist.auctionResultsConnection)

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const applyFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.applyFiltersAction
  )
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
    {
      slice: "state",
      counts: [
        {
          value: artist.upcomingAuctionResults?.totalCount || 0,
          name: "state",
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

    if (Array.isArray(initialFilters)) {
      setInitialFilterStateAction(initialFilters)
      applyFiltersAction()
    }
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

  const AuctionResultsInfoModal = () => (
    <>
      <Text>
        These auction results bring together sale data from top auction houses around the world,
        including Christie’s, Sotheby’s, Phillips and Bonhams. Results are updated daily.
      </Text>
      <Spacer y={2} />
      <Text>
        Please note that the sale price includes the hammer price and buyer’s premium, as well as
        any other additional fees (e.g., Artist’s Resale Rights).
      </Text>
    </>
  )

  const resultsString =
    Number(artist.auctionResultsConnection?.totalCount) === 1 ? "result" : "results"

  const auctionResultsByState = useMemo(() => {
    const appliedAuctionResultsStateFilter = appliedFilters?.find(
      (filter) => filter.paramName === FilterParamName.state
    )?.paramValue

    const hideUpcomingAuctions = appliedAuctionResultsStateFilter === AuctionResultsState.PAST

    const res: Array<{
      id: "upcoming" | "past"
      title: string
      data: Array<
        ExtractNodeType<ArtistInsightsAuctionResults_artist$data["auctionResultsConnection"]>
      >
      count: number
    }> = []

    // We don't want to show the upcoming auctions section if the user has already filtered them out
    if (!hideUpcomingAuctions) {
      res.push({
        id: "upcoming",
        title: "Upcoming Auctions",
        data: [],
        count: artist.upcomingAuctionResults?.totalCount || 0,
      })
    }

    res.push({
      id: "past",
      title: "Past Auctions",
      data: [],
      count: artist.pastAuctionResults?.totalCount || 0,
    })

    auctionResults.forEach((auctionResult) => {
      if (auctionResult.isUpcoming) {
        res.find((item) => item.id === "upcoming")?.data.push(auctionResult)
      } else {
        res.find((item) => item.id === "past")?.data.push(auctionResult)
      }
    })

    return res.filter((section) => section.count > 0 && (__TEST__ || section.data.length > 0))
  }, [auctionResults, appliedFilters])

  if (!artist.statuses?.auctionLots) {
    return (
      <View onLayout={onLayout}>
        <ArtistInsightsEmpty my={6} />
      </View>
    )
  }

  return (
    <View
      // Setting min height to keep scroll position when user searches with the keyword filter.
      style={{ minHeight: screenHeight }}
      onLayout={onLayout}
    >
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
          onFocus={scrollToTop}
          onTypingStart={() => setKeywordFilterRefetching(true)}
        />
      </Flex>
      {auctionResults.length ? (
        <SectionList
          sections={auctionResultsByState}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AuctionResultListItemFragmentContainer
              auctionResult={item}
              onPress={() => {
                tracking.trackEvent(tracks.tapAuctionGroup(item.internalID, artist.internalID))
              }}
            />
          )}
          renderSectionHeader={({ section: { title, count } }) => (
            <Flex px={2} my={2}>
              <Text variant="sm-display">{title}</Text>
              <Text variant="xs" color="mono60">
                {count} result{count > 1 ? "s" : ""}
              </Text>
            </Flex>
          )}
          onScrollEndDrag={onScrollEndDragChange}
          ItemSeparatorComponent={AuctionResultListSeparator}
          style={{ width: screenWidth, left: -20 }}
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
        state: { type: "AuctionResultsState", defaultValue: ALL }
      ) {
        birthday
        slug
        id
        internalID
        statuses {
          auctionLots
        }
        pastAuctionResults: auctionResultsConnection(
          state: PAST
          allowEmptyCreatedDates: $allowEmptyCreatedDates
          categories: $categories
          earliestCreatedYear: $earliestCreatedYear
          keyword: $keyword
          latestCreatedYear: $latestCreatedYear
          organizations: $organizations
          sizes: $sizes
        ) {
          totalCount
        }
        upcomingAuctionResults: auctionResultsConnection(
          state: UPCOMING
          allowEmptyCreatedDates: $allowEmptyCreatedDates
          categories: $categories
          earliestCreatedYear: $earliestCreatedYear
          keyword: $keyword
          latestCreatedYear: $latestCreatedYear
          organizations: $organizations
          sizes: $sizes
        ) {
          totalCount
        }
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
          state: $state
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
              saleDate
              isUpcoming
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
        $state: AuctionResultsState
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
              state: $state
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
