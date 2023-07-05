import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"

import {
  Text,
  Button,
  Tabs,
  BellIcon,
  Spacer,
  Box,
  Flex,
  useSpace,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { MasonryFlashList } from "@shopify/flash-list"
import { ArtistArtworks_artist$data } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistArtworksFilterHeader } from "app/Components/Artist/ArtistArtworks/ArtistArtworksFilterHeader"
import { useShowArtworksFilterModal } from "app/Components/Artist/ArtistArtworks/hooks/useShowArtworksFilterModal"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { Aggregations, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { convertSavedSearchCriteriaToFilterParams } from "app/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import React, { useEffect } from "react"
import { useHeaderMeasurements } from "react-native-collapsible-tab-view"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist$data
  searchCriteria: SearchCriteriaAttributes | null
  relay: RelayPaginationProp
  predefinedFilters?: FilterArray
}

type FilterModalOpenedFrom = "sortAndFilter" | "createAlert"

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const { showFilterArtworksModal, openFilterArtworksModal, closeFilterArtworksModal } =
    useShowArtworksFilterModal({ artist })

  return (
    <Tabs.ScrollView keyboardShouldPersistTaps="handled">
      <Tabs.SubTabBar>
        <ArtistArtworksFilterHeader artist={artist!} />
      </Tabs.SubTabBar>

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
        visible={showFilterArtworksModal}
        name={artist.name ?? ""}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.ArtistArtworks}
        shouldShowCreateAlertButton
      />
    </Tabs.ScrollView>
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
  ...props
}) => {
  const space = useSpace()

  const { currentScrollY } = useScreenScrollContext()
  const { top } = useHeaderMeasurements()
  const tracking = useTracking()
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const { openFilterArtworksModal } = useShowArtworksFilterModal({ artist })

  const { width, height } = useScreenDimensions()

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )

  // const artworks = artist.artworks
  const artworks = extractNodes(artist.artworks)
  // const artworksCount = artworks?.length

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

  // const filteredArtworks = () => {
  //   if (artworksCount === 0) {
  //     return (
  // <Box mb="80px" pt={2}>
  //   <FilteredArtworkGridZeroState
  //     id={artist.id}
  //     slug={artist.slug}
  //     trackClear={trackClear}
  //     hideClearButton={!appliedFilters.length}
  //   />
  // </Box>
  //     )
  //   } else {
  //     return (
  //       <>
  //         <Spacer y={2} />
  //         <InfiniteScrollArtworksGrid
  //           connection={artist.artworks!}
  //           loadMore={relay.loadMore}
  //           hasMore={relay.hasMore}
  //           {...props}
  //           contextScreenOwnerType={OwnerType.artist}
  //           contextScreenOwnerId={artist.internalID}
  //           contextScreenOwnerSlug={artist.slug}
  //         />
  //       </>
  //     )
  //   }
  // }

  if (!artist.statuses?.artworks) {
    return (
      <>
        <Spacer y={6} />

        <Text variant="md" textAlign="center">
          Get notified when new works are available
        </Text>

        <Text variant="md" textAlign="center" color="black60">
          There are currently no works for sale for this artist. Create an alert, and we’ll let you
          know when new works are added.
        </Text>

        <Spacer y={2} />

        <Button
          variant="outline"
          mx="auto"
          icon={<BellIcon />}
          onPress={() => {
            openFilterArtworksModal("createAlert")

            tracking.trackEvent({
              action: ActionType.tappedCreateAlert,
              context_screen_owner_type: OwnerType.artist,
              context_screen_owner_id: artist.internalID,
              context_screen_owner_slug: artist.slug,
              context_module: ContextModule.artworkGrid,
            })
          }}
        >
          Create Alert
        </Button>

        <Spacer y={6} />
      </>
    )
  }
  const columnCount = 2

  // need to prevent the onEndReached from triggering on mount
  // when the lists parent doesn't have fixed height (not flex)
  // the onEndReached is getting triggered on mount and never when it should

  // console.warn({ currentScrollY })

  return (
    <Flex flex={1} justifyContent="center" m={-2} bg="red10">
      <Flex height={600} bg="blue10">
        <MasonryFlashList
          indicatorStyle="white"
          // onLayout={(test) => {
          //   // console.warn("flipper", test.nativeEvent.layout.height)
          // }}
          testID="MasonryList"
          data={artworks}
          // not 100% sure if we need this 👇
          // optimizeItemArrangement
          // // not 100% sure if we need this 👇
          // overrideItemLayout={(layout, item) => {
          //   layout.size = item?.height
          // }}
          numColumns={columnCount}
          // estimatedItemSize 👇 Average or median size for elements in the list. Doesn't have to be very accurate but
          // a good estimate can improve performance. A quick look at Element Inspector can help you
          // determine this. If you're confused between two values, the smaller value is a better choice.
          // For vertical lists provide average height and for horizontal average width.
          // Read more about it here: https://shopify.github.io/flash-list/docs/estimated-item-size
          estimatedItemSize={100}
          ListHeaderComponent={
            // <Component item={{ index: 0, height: 100 }} text="Header" backgroundColor="red" />
            <Spacer y={4} />
          }
          // ListFooterComponent={
          //   // replace it with loading state indicator
          //   <Component item={{ index: 0, height: 100 }} text="Footer" backgroundColor="lightblue" />
          // }
          ListEmptyComponent={
            <Box mb="80px" pt={2}>
              <FilteredArtworkGridZeroState
                id={artist.id}
                slug={artist.slug}
                trackClear={trackClear}
                hideClearButton={!appliedFilters.length}
              />
            </Box>
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item, columnIndex }) => {
            const imgAspectRatio = item.image?.aspectRatio ?? 1
            const imgWidth = width / 2 - space(2) - space(1)
            const imgHeight = imgWidth / imgAspectRatio

            return (
              <Flex pl={columnIndex === 1 ? 1 : 0} pr={columnIndex === 0 ? 1 : 0} py={1}>
                <ArtworkGridItem artwork={item} height={imgHeight} />
              </Flex>
            )
          }}
          // onLoad={({ elapsedTimeInMs }) => {
          //   console.log("List Load Time", elapsedTimeInMs)
          // }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          onViewableItemsChanged={({ viewableItems, changed }) => {

            console.warn("flipper viewableItems", viewableItems)
            console.warn("flipper changed", changed)
            console.warn("flipper called")
          }}
          contentContainerStyle={{
            paddingHorizontal: space(2),
            paddingBottom: space(4),
            backgroundColor: "purple",
          }}
          // onEndReached={() => console.warn("onEndReached")}
          // onEndReachedThreshold={0.5}
        />
      </Flex>
    </Flex>
  )
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
        ...ArtistArtworksFilterHeader_artist
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
              slug
              id
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork  # @arguments(includeAllImages: false)
                # ...MyCollectionArtworkGridItem_artwork
                # @skip(if: $skipMyCollection)
                @arguments(includeAllImages: false)
            }
          }
          counts {
            total
          }
          # ...InfiniteScrollArtworksGrid_connection
          pageInfo {
            hasNextPage
            startCursor
            endCursor
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
