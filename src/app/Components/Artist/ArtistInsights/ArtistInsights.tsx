import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { Box, Flex, Tabs, useSpace } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistInsights_artist$data } from "__generated__/ArtistInsights_artist.graphql"
import { ARTIST_HEADER_HEIGHT } from "app/Components/Artist/ArtistHeader"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import {
  FilterArray,
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEBOUNCE_DELAY } from "app/Components/ArtworkFilter/Filters/KeywordFilter"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import Spinner from "app/Components/Spinner"
import { PAGE_SIZE } from "app/Components/constants"
import { AuctionResultsState } from "app/Scenes/AuctionResults/AuctionResultsScreenWrapper"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { debounce } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { View } from "react-native"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import {
  ArtistInsightsListItem,
  AuctionResultsHeader,
  AuctionResultsSectionTitle,
  keyExtractor,
} from "./ArtistInsightsListItem"
import { ArtistInsightsEmpty } from "./ArtistsInsightsEmpty"
import { MarketStatsQueryRenderer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist$data
  relay: RelayPaginationProp
  initialFilters?: FilterArray
}

const SCROLL_UP_TO_SHOW_THRESHOLD = 150
const FILTER_BUTTON_OFFSET = 300

const ArtistInsightsContent: React.FC<ArtistInsightsProps> = (props) => {
  const { artist, relay, initialFilters } = props
  const space = useSpace()
  const tracking = useTracking()
  const { width: screenWidth } = useScreenDimensions()

  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const [keywordFilterRefetching, setKeywordFilterRefetching] = useState(false)

  const auctionResultsYCoordinate = useRef<number>(0)
  const contentYScrollOffset = useRef<number>(0)
  const { currentScrollYAnimated } = useScreenScrollContext()

  // Filter store actions and state
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

  const endKeywordFilterRefetching = useMemo(
    () => debounce(() => setKeywordFilterRefetching(false), DEBOUNCE_DELAY),
    []
  )

  // Aggregations for filters
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

  const scrollToTop = useCallback(() => {
    let auctionResultYOffset = auctionResultsYCoordinate.current

    // if we scroll up less than SCROLL_UP_TO_SHOW_THRESHOLD the header won't expand and we need another offset
    if (contentYScrollOffset.current - 2 * auctionResultYOffset <= SCROLL_UP_TO_SHOW_THRESHOLD) {
      auctionResultYOffset += ARTIST_HEADER_HEIGHT
    }
  }, [auctionResultsYCoordinate, contentYScrollOffset])

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

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(false)
  }

  useAnimatedReaction(
    () => currentScrollYAnimated.value,
    (value) => {
      if (value > FILTER_BUTTON_OFFSET) {
        runOnJS(setIsFilterButtonVisible)(true)
      } else {
        runOnJS(setIsFilterButtonVisible)(false)
      }
    }
  )

  const focusedTab = useFocusedTab()

  useEffect(() => {
    if (focusedTab === "Insights") {
      tracking.trackEvent(tracks.screen(artist.internalID, artist.slug))
    }
  }, [focusedTab])

  // Extract auction results from connection
  const auctionResults = extractNodes(artist.auctionResultsConnection)

  // Load more auction results
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

  // Build the unified data array
  const listData = useMemo(() => {
    const items: ArtistInsightsListItem[] = [{ type: "marketSignals" }]

    // If no auction lots, show empty state
    if (!artist.statuses?.auctionLots) {
      items.push({ type: "emptyState" })
      return items
    }

    items.push({ type: "auctionResultsHeader" })

    // If filters return no results, show empty state after header
    if (auctionResults.length === 0) {
      items.push({ type: "emptyState" })
      return items
    }

    // Split auction results by state (upcoming vs past)
    const appliedAuctionResultsStateFilter = appliedFilters?.find(
      (filter) => filter.paramName === FilterParamName.state
    )?.paramValue

    const hideUpcomingAuctions = appliedAuctionResultsStateFilter === AuctionResultsState.PAST

    const upcomingAuctions = auctionResults.filter((result) => result.isUpcoming)
    const pastAuctions = auctionResults.filter((result) => !result.isUpcoming)

    const upcomingCount = artist.upcomingAuctionResults?.totalCount || 0
    const pastCount = artist.pastAuctionResults?.totalCount || 0

    // Add upcoming auctions section if applicable
    if (!hideUpcomingAuctions && upcomingCount > 0 && upcomingAuctions.length > 0) {
      items.push({
        type: "sectionTitle",
        id: "upcoming",
        title: "Upcoming Auctions",
        count: upcomingCount,
      })
      upcomingAuctions.forEach((auctionResult) => {
        items.push({ type: "auctionResult", auctionResult })
      })
    }

    // Add past auctions section
    if (pastCount > 0 && pastAuctions.length > 0) {
      items.push({ type: "sectionTitle", id: "past", title: "Past Auctions", count: pastCount })
      pastAuctions.forEach((auctionResult) => {
        items.push({ type: "auctionResult", auctionResult })
      })
    }

    return items
  }, [
    auctionResults,
    appliedFilters,
    artist.statuses?.auctionLots,
    artist.upcomingAuctionResults?.totalCount,
    artist.pastAuctionResults?.totalCount,
  ])

  // Render item based on type
  const renderItem = useCallback(
    ({ item }: { item: ArtistInsightsListItem }) => {
      switch (item.type) {
        case "marketSignals":
          return (
            <MarketStatsQueryRenderer
              artistInternalID={artist.internalID}
              environment={relay.environment}
            />
          )
        case "auctionResultsHeader":
          return (
            <AuctionResultsHeader
              artist={artist}
              appliedFilters={appliedFilters}
              onScrollToTop={scrollToTop}
              keywordFilterRefetching={keywordFilterRefetching}
              onKeywordFilterTypingStart={() => setKeywordFilterRefetching(true)}
            />
          )
        case "sectionTitle":
          return (
            <View style={{ width: screenWidth, marginLeft: -space(2) }}>
              <AuctionResultsSectionTitle title={item.title} count={item.count} />
            </View>
          )
        case "auctionResult":
          return (
            <View style={{ width: screenWidth, marginLeft: -space(2) }}>
              <AuctionResultListItemFragmentContainer
                auctionResult={item.auctionResult}
                onPress={() => {
                  tracking.trackEvent(
                    tracks.tapAuctionGroup(item.auctionResult.internalID, artist.internalID)
                  )
                }}
              />
            </View>
          )
        case "emptyState":
          if (!artist.statuses?.auctionLots) {
            return (
              <View>
                <ArtistInsightsEmpty my={6} />
              </View>
            )
          }
          return (
            <Box my="80px">
              <FilteredArtworkGridZeroState
                id={artist.id}
                slug={artist.slug}
                hideClearButton={isKeywordFilterActive}
              />
            </Box>
          )
        default:
          return null
      }
    },
    [
      artist,
      relay.environment,
      appliedFilters,
      scrollToTop,
      keywordFilterRefetching,
      screenWidth,
      space,
      tracking,
      isKeywordFilterActive,
    ]
  )

  // Custom item separator - only show between auction result items
  const ItemSeparatorComponent = useCallback(
    ({ leadingItem }: { leadingItem: ArtistInsightsListItem }) => {
      if (leadingItem.type === "auctionResult") {
        return <AuctionResultListSeparator />
      }
      return null
    },
    []
  )

  return (
    <Flex flex={1}>
      <Tabs.FlatList
        style={{
          marginTop: space(2),
          paddingBottom: space(4),
        }}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onEndReached={loadMoreAuctionResults}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() =>
          loadingMoreData ? (
            <Flex my={4}>
              <Spinner />
            </Flex>
          ) : null
        }
      />

      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        id={artist.internalID}
        slug={artist.slug}
        mode={FilterModalMode.AuctionResults}
        exitModal={closeFilterModal}
        closeModal={closeFilterModal}
        title="Filter auction results"
      />
      <AnimatedArtworkFilterButton
        isVisible={isFilterButtonVisible}
        onPress={openFilterModal}
        text="Filter auction results"
      />
    </Flex>
  )
}

// Wrapper component that provides the filter store
export const ArtistInsights: React.FC<ArtistInsightsProps> = (props) => {
  return (
    <ArtworkFiltersStoreProvider>
      <ArtistInsightsContent {...props} />
    </ArtworkFiltersStoreProvider>
  )
}

export const ArtistInsightsFragmentContainer = createPaginationContainer(
  ArtistInsights,
  {
    artist: graphql`
      fragment ArtistInsights_artist on Artist
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
        name
        id
        internalID
        slug
        birthday
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
              isUpcoming
              saleDate
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
      query ArtistInsightsQuery(
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
          ...ArtistInsights_artist
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
  openFilter: (id: string, slug: string) => {
    return {
      action_name: "filter",
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  closeFilter: (id: string, slug: string) => {
    return {
      action_name: "closeFilterWindow",
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  screen: (id: string, slug: string) =>
    screen({
      context_screen_owner_type: OwnerType.artistAuctionResults,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }),
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
