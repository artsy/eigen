import { OwnerType } from "@artsy/cohesion"
import { Box, Tabs, useScreenDimensions, Flex, useSpace, Spinner } from "@artsy/palette-mobile"
import { MasonryFlashListRef } from "@shopify/flash-list"
import { ArtistSeriesArtworks_artistSeries$data } from "__generated__/ArtistSeriesArtworks_artistSeries.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesArtworksProps {
  artistSeries: ArtistSeriesArtworks_artistSeries$data
  relay: RelayPaginationProp
}

const PAGE_SIZE = 20

export const ArtistSeriesArtworks: React.FC<ArtistSeriesArtworksProps> = ({
  artistSeries,
  relay,
}) => {
  const tracking = useTracking()
  const { width } = useScreenDimensions()
  const space = useSpace()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const artworks = artistSeries?.artistSeriesArtworks
  const artworksTotal = artworks?.counts?.total ?? 0
  const artworksList = useMemo(
    () => extractNodes(artistSeries.artistSeriesArtworks),
    [artistSeries.artistSeriesArtworks]
  )
  const shouldDisplaySpinner = !!artworksList.length && !!relay.isLoading() && !!relay.hasMore()
  const gridRef = useRef<MasonryFlashListRef<(typeof artworksList)[0]>>(null)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )

  useArtworkFilters({
    relay,
    aggregations: artworks?.aggregations,
    componentPath: "ArtistSeries/ArtistSeriesArtworks",
    pageSize: PAGE_SIZE,
  })

  useEffect(() => {
    setFiltersCountAction({
      total: artworksTotal,
      followedArtists: null,
    })
  }, [artworksTotal])

  const handleFilterToggle = () => {
    setFilterArtworkModalVisible((prev) => {
      return !prev
    })
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterToggle()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterToggle()
  }

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(10)
    }
  }, [relay.hasMore(), relay.isLoading()])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const renderItem = useCallback(({ item, index, columnIndex }) => {
    const imgAspectRatio = item.image?.aspectRatio ?? 1
    const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
    const imgHeight = imgWidth / imgAspectRatio

    return (
      <Flex
        pl={columnIndex === 0 ? 0 : 1}
        pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
        mt={2}
      >
        <ArtworkGridItem
          itemIndex={index}
          contextScreenOwnerType={OwnerType.artistSeries}
          contextScreenOwnerId={artistSeries.internalID}
          contextScreenOwnerSlug={artistSeries.slug}
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  return (
    <>
      <Tabs.Masonry
        testID="ArtistSeriesArtworksGrid"
        data={artworksList}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        innerRef={gridRef}
        ListEmptyComponent={
          <Box mb="80px" pt={2}>
            <FilteredArtworkGridZeroState
              id={artistSeries.internalID}
              slug={artistSeries.slug}
              trackClear={trackClear}
            />
          </Box>
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <Tabs.SubTabBar>
            <HeaderArtworksFilterWithTotalArtworks onPress={openFilterArtworksModal} />
          </Tabs.SubTabBar>
        }
        ListFooterComponent={
          !!shouldDisplaySpinner ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
      />
      <ArtworkFilterNavigator
        id={artistSeries.internalID}
        slug={artistSeries.slug}
        visible={!!isFilterArtworksModalVisible}
        name={artistSeries.title ?? ""}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.ArtistSeries}
        shouldShowCreateAlertButton
      />
    </>
  )
}

export const ArtistSeriesArtworksFragmentContainer = createPaginationContainer(
  ArtistSeriesArtworks,
  {
    artistSeries: graphql`
      fragment ArtistSeriesArtworks_artistSeries on ArtistSeries
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        title
        slug
        internalID
        artistSeriesArtworks: filterArtworksConnection(
          first: $count
          after: $cursor
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
          input: $input
        ) @connection(key: "ArtistSeries_artistSeriesArtworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          edges {
            node {
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
          counts {
            total
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.artistSeries.artistSeriesArtworks
    },
    getFragmentVariables(previousVariables, count) {
      // Relay is unable to infer this for this component, I'm not sure why.
      return {
        ...previousVariables,
        count,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        props,
        count,
        cursor,
        id: props.artistSeries.slug,
        input: fragmentVariables.input,
      }
    },
    query: graphql`
      query ArtistSeriesArtworksInfiniteScrollGridQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        artistSeries(id: $id) {
          ...ArtistSeriesArtworks_artistSeries
            @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
