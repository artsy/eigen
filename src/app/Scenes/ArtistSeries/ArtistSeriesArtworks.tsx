import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MasonryFlashListRef } from "@shopify/flash-list"
import { ArtistSeriesArtworks_artistSeries$key } from "__generated__/ArtistSeriesArtworks_artistSeries.graphql"
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
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesArtworksProps {
  artistSeries: ArtistSeriesArtworks_artistSeries$key
}

const PAGE_SIZE = 10

export const ArtistSeriesArtworks: React.FC<ArtistSeriesArtworksProps> = ({ artistSeries }) => {
  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment(
    fragment,
    artistSeries
  )
  const tracking = useTracking()
  const { width } = useScreenDimensions()
  const space = useSpace()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const artworks = data?.artistSeriesArtworks
  const artworksTotal = artworks?.counts?.total ?? 0
  const artworksList = useMemo(
    () => extractNodes(data.artistSeriesArtworks),
    [data.artistSeriesArtworks]
  )
  const shouldDisplaySpinner = isLoadingNext && hasNext
  const gridRef = useRef<MasonryFlashListRef<(typeof artworksList)[0]>>(null)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )

  useArtworkFilters({
    refetch,
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

  const openFilterArtworksModal = () => {
    tracking.trackEvent(tracks.openFilterWindow(data.id, data.slug))

    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilterWindow(data.id, data.slug))

    setFilterArtworkModalVisible(false)
  }

  const loadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(PAGE_SIZE, {
        onComplete: (error) => {
          if (error) {
            console.error("ArtistSeriesArtworks.tsx", error.message)
          }
        },
      })
    }
  }, [isLoadingNext, hasNext])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent(tracks.clearFilters(id, slug))
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
          contextScreenOwnerId={data.internalID}
          contextScreenOwnerSlug={data.slug}
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
              id={data.internalID}
              slug={data.slug}
              trackClear={trackClear}
            />
          </Box>
        }
        keyExtractor={(item) => item?.id}
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
          <AnimatedMasonryListFooter shouldDisplaySpinner={shouldDisplaySpinner} />
        }
      />
      <ArtworkFilterNavigator
        id={data.internalID}
        slug={data.slug}
        visible={!!isFilterArtworksModalVisible}
        name={data.title ?? ""}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.ArtistSeries}
        shouldShowCreateAlertButton
      />
    </>
  )
}

const fragment = graphql`
  fragment ArtistSeriesArtworks_artistSeries on ArtistSeries
  @refetchable(queryName: "ArtistSeriesArtworksPaginationQuery")
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
        LOCATION_CITY
        MAJOR_PERIOD
        MATERIALS_TERMS
        MEDIUM
        PARTNER
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
      counts {
        total
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
    }
  }
`
const tracks = {
  clearFilters: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.ContextModules.ArtworkGrid,
    context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openFilterWindow: (id: string, slug: string) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
    context_screen: Schema.PageNames.ArtistSeriesPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterWindow: (id: string, slug: string) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
    context_screen: Schema.PageNames.ArtistSeriesPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
