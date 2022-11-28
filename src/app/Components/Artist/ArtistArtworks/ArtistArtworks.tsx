import { MasonryFlashList } from "@shopify/flash-list"
import { ArtistArtworks_artist$data } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { Aggregations, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { convertSavedSearchCriteriaToFilterParams } from "app/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { Props as InfiniteScrollGridProps } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageView } from "app/Components/StickyTabPage/StickyTabPageView"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Box, Flex, Message, OpaqueImageView, Text, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Platform, useWindowDimensions } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { SavedSearchButtonV2 } from "./SavedSearchButtonV2"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist$data
  searchCriteria: SearchCriteriaAttributes | null
  relay: RelayPaginationProp
  predefinedFilters?: FilterArray
}

type FilterModalOpenedFrom = "sortAndFilter" | "createAlert"

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = (openedFrom: FilterModalOpenedFrom) => {
    if (openedFrom === "sortAndFilter") {
      tracking.trackEvent({
        action_name: "filter",
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_id: artist.id,
        context_screen_owner_slug: artist.slug,
        action_type: Schema.ActionTypes.Tap,
      })
    }

    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: artist.id,
      context_screen_owner_slug: artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })

    handleCloseFilterArtworksModal()
  }

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageView>
        <ArtistArtworksContainer
          {...props}
          artist={artist}
          relay={relay}
          openFilterModal={openFilterArtworksModal}
        />
        <ArtworkFilterNavigator
          {...props}
          id={artist.internalID}
          slug={artist.slug}
          visible={isFilterArtworksModalVisible}
          name={artist.name ?? ""}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.ArtistArtworks}
          shouldShowCreateAlertButton
        />
      </StickyTabPageView>
    </ArtworkFiltersStoreProvider>
  )
}

interface ArtistArtworksContainerProps {
  openFilterModal: (openedFrom: FilterModalOpenedFrom) => void
}

const ArtistArtworksContainer: React.FC<ArtworksGridProps & ArtistArtworksContainerProps> = ({
  artist,
  relay,
  searchCriteria,
  predefinedFilters,
  openFilterModal,
  ...props
}) => {
  const tracking = useTracking()
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )

  const appliedFiltersCount = useSelectedFiltersCount()
  const artworks = artist.artworks
  const artworksCount = artworks?.edges?.length

  useArtworkFilters({
    relay,
    aggregations: artist.aggregations?.aggregations,
    componentPath: "ArtistArtworks/ArtistArtworks",
  })

  useEffect(() => {
    let filters: FilterArray = []

    if (Array.isArray(predefinedFilters)) {
      filters = predefinedFilters
    }

    if (searchCriteria && artist.aggregations?.aggregations) {
      const params = convertSavedSearchCriteriaToFilterParams(
        searchCriteria,
        artist.aggregations.aggregations as Aggregations
      )
      const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
        (sortEntity) => sortEntity.paramValue === "-published_at"
      )!

      filters = [...params, sortFilterItem]
    }

    setInitialFilterStateAction(filters)
  }, [])

  // TODO: Convert to use cohesion
  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        <ArtworksFilterHeader
          onFilterPress={() => openFilterModal("sortAndFilter")}
          selectedFiltersCount={appliedFiltersCount}
          childrenPosition="left"
        >
          <SavedSearchButtonV2
            artistId={artist.internalID}
            artistSlug={artist.slug}
            onPress={() => openFilterModal("createAlert")}
          />
        </ArtworksFilterHeader>
      </Box>
    )
  }, [appliedFiltersCount])

  const filteredArtworks = () => {
    if (artworksCount === 0) {
      return (
        <Box mb="80px" pt={1}>
          <FilteredArtworkGridZeroState
            id={artist.id}
            slug={artist.slug}
            trackClear={trackClear}
            hideClearButton={!appliedFilters.length}
          />
        </Box>
      )
    } else {
      const space = useSpace()
      const { width } = useScreenDimensions()
      const artworkdata = extractNodes(artist.artworks)

      const fetchNextPage = () => {
        if (!relay.hasMore() || relay.isLoading()) {
          return
        }

        relay.loadMore(PAGE_SIZE)
      }

      const { height } = useWindowDimensions()
      const { headerOffsetY } = useStickyTabPageContext()

      // TODO: remaining stuff
      // 1. top list inset
      // 2. set proper header height vs 150
      // 3. scroll behaviour down and up when should we make the header go back down?
      // 4. replace dummy artwork component with artwork component and see if it is flashing or not

      return (
        <Box flex={1} height={height}>
          <MasonryFlashList
            contentContainerStyle={{ paddingHorizontal: space(2) }}
            onScroll={({
              nativeEvent: {
                contentOffset: { y: contentOffsetY },
              },
            }) => {
              console.warn({ contentOffsetY })
              let newHeaderOffset = -contentOffsetY

              if (newHeaderOffset > 0) {
                newHeaderOffset = 0
              }

              if (newHeaderOffset < -150) {
                newHeaderOffset = -150
              }

              console.warn({ newHeaderOffset })
              headerOffsetY.setValue(newHeaderOffset)
              // Animated.greaterThan(Animated.multiply(-1, headerOffsetY), scrollOffsetY),
            }}
            data={artworkdata}
            numColumns={2}
            estimatedItemSize={width / 2}
            renderItem={({ item }) => {
              return (
                <Flex backgroundColor="red">
                  <Text>{item.title}</Text>
                  <OpaqueImageView
                    aspectRatio={item.image?.aspectRatio}
                    width={width / 2 - space(2)}
                    imageURL={item.image?.url}
                  />
                </Flex>
              )
            }}
            ListFooterComponent={() =>
              relay.isLoading() ? (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  p="3"
                  pb="9"
                  style={{ opacity: relay.hasMore() ? 1 : 0 }}
                >
                  <ActivityIndicator color={Platform.OS === "android" ? "black" : undefined} />
                </Flex>
              ) : null
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              console.warn("i was called")
              fetchNextPage()
            }}
          />
        </Box>
      )
    }
  }

  if (!artist.statuses?.artworks) {
    return (
      <Message
        variant="default"
        title="No works available by the artist at this time"
        text="Create an Alert to receive notifications when new works are added"
        bodyTextStyle={{
          color: "black60",
        }}
      />
    )
  }

  return artist.artworks ? filteredArtworks() : null
}

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        slug
        name
        internalID
        aggregations: filterArtworksConnection(
          first: 0
          aggregations: [
            COLOR
            DIMENSION_RANGE
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
            PRICE_RANGE
            SIMPLE_PRICE_HISTOGRAM
          ]
        ) {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
        }
        artworks: filterArtworksConnection(first: $count, after: $cursor, input: $input)
          @connection(key: "ArtistArtworksGrid_artworks") {
          edges {
            node {
              id
              title
              image {
                url(version: "large")
                aspectRatio
              }
            }
          }
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          counts {
            total
          }
        }
        statuses {
          artworks
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.artist && props.artist.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        id: props.artist.id,
        input: fragmentVariables.input,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtistArtworksQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)
