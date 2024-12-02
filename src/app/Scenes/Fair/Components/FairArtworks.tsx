import { OwnerType } from "@artsy/cohesion"
import { Flex, Spinner, Tabs, Text, useSpace } from "@artsy/palette-mobile"
import { MasonryFlashList } from "@shopify/flash-list"
import { FairArtworks_fair$key } from "__generated__/FairArtworks_fair.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  aggregationsType,
  aggregationsWithFollowedArtists,
  FilterArray,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { FAIR2_ARTWORKS_PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { pluralize } from "app/utils/pluralize"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useState } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FairArtworksProps {
  fair: FairArtworks_fair$key
  initiallyAppliedFilter?: FilterArray
  aggregations?: aggregationsType
  followedArtistCount?: number | null | undefined
}

export const FairArtworks: React.FC<FairArtworksProps> = ({
  fair,
  initiallyAppliedFilter,
  aggregations,
  followedArtistCount,
}) => {
  const tracking = useTracking()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment(fragment, fair)

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const artworks = data.fairArtworks
  const artworksTotal = artworks?.counts?.total ?? 0
  const dispatchFollowedArtistCount =
    (followedArtistCount || artworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || artworks?.aggregations) ?? []) as aggregationsType
  const dispatchAggregations = aggregationsWithFollowedArtists(
    dispatchFollowedArtistCount,
    artworkAggregations
  )

  useArtworkFilters({
    refetch,
    aggregations: dispatchAggregations,
    componentPath: "Fair/FairArtworks",
    pageSize: FAIR2_ARTWORKS_PAGE_SIZE,
  })

  useEffect(() => {
    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal])

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
          contextScreenOwnerType={OwnerType.fair}
          contextScreenOwnerId={data.internalID}
          contextScreenOwnerSlug={data.slug}
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  if (!data) {
    return null
  }

  const handleOnEndReached = () => {
    if (!isLoadingNext && hasNext) {
      loadNext(FAIR2_ARTWORKS_PAGE_SIZE, {
        onComplete: (error) => {
          if (error) {
            console.error("FairArtworks.tsx", error.message)
          }
        },
      })
    }
  }

  const handleTrackClear = (id: string, slug: string) => {
    tracking.trackEvent(tracks.trackClear(id, slug))
  }

  const handleFilterOpen = () => {
    setFilterArtworkModalVisible(true)

    tracking.trackEvent(tracks.openArtworksFilter(fair))
  }

  const handleFilterClose = () => {
    setFilterArtworkModalVisible(false)

    tracking.trackEvent(tracks.closeArtworksFilter(fair))
  }

  const filteredArtworks = extractNodes(data.fairArtworks)
  const artworksCount = data.fairArtworks?.counts?.total ?? 0

  return (
    <>
      <Tabs.Masonry
        data={filteredArtworks}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Flex mb={6}>
            <FilteredArtworkGridZeroState
              id={data.internalID}
              slug={data.slug}
              trackClear={handleTrackClear}
            />
          </Flex>
        }
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <>
            <Tabs.SubTabBar>
              <HeaderArtworksFilterWithTotalArtworks
                hideArtworksCount={true}
                onPress={handleFilterOpen}
              />
            </Tabs.SubTabBar>

            <Text variant="xs" weight="medium">{`${artworksCount} ${pluralize(
              "Artwork",
              artworksCount
            )}:`}</Text>
          </>
        }
        ListFooterComponent={<AnimatedMasonryListFooter shouldDisplaySpinner={isLoadingNext} />}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        renderItem={renderItem}
      />
      <ArtworkFilterNavigator
        visible={isFilterArtworksModalVisible}
        id={data.internalID}
        slug={data.slug}
        mode={FilterModalMode.Fair}
        exitModal={handleFilterClose}
        closeModal={handleFilterClose}
      />
    </>
  )
}

// Performant version of FairArtworks that doesn't use tabs
// left in the same file intentionally to make it easier to compare the two
// forcing changes in both components
export const FairArtworksWithoutTabs: React.FC<FairArtworksProps> = ({
  fair,
  initiallyAppliedFilter,
  aggregations,
  followedArtistCount,
}) => {
  const tracking = useTracking()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment(fragment, fair)

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  const artworks = data.fairArtworks
  const artworksTotal = artworks?.counts?.total ?? 0
  const dispatchFollowedArtistCount =
    (followedArtistCount || artworks?.counts?.followedArtists) ?? 0
  const artworkAggregations = ((aggregations || artworks?.aggregations) ?? []) as aggregationsType
  const dispatchAggregations = aggregationsWithFollowedArtists(
    dispatchFollowedArtistCount,
    artworkAggregations
  )

  useArtworkFilters({
    refetch,
    aggregations: dispatchAggregations,
    componentPath: "Fair/FairArtworks",
    pageSize: MASONRY_LIST_PAGE_SIZE,
  })

  useEffect(() => {
    if (initiallyAppliedFilter) {
      setInitialFilterStateAction(initiallyAppliedFilter)
    }
  }, [])

  useEffect(() => {
    setFiltersCountAction({ ...counts, total: artworksTotal })
  }, [artworksTotal])

  if (!data) {
    return null
  }

  const handleOnEndReached = () => {
    if (!isLoadingNext && hasNext) {
      loadNext(MASONRY_LIST_PAGE_SIZE, {
        onComplete: (error) => {
          if (error) {
            console.error("FairArtworks.tsx", error.message)
          }
        },
      })
    }
  }

  const handleTrackClear = (id: string, slug: string) => {
    tracking.trackEvent(tracks.trackClear(id, slug))
  }

  const handleFilterToggle = () => {
    setFilterArtworkModalVisible((prev) => {
      if (!prev) {
        tracking.trackEvent(tracks.openArtworksFilter(fair))
      } else {
        tracking.trackEvent(tracks.closeArtworksFilter(fair))
      }
      return !prev
    })
  }

  const filteredArtworks = extractNodes(data.fairArtworks)

  return (
    <>
      <MasonryFlashList
        data={filteredArtworks}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Flex mb={6}>
            <FilteredArtworkGridZeroState
              id={data.internalID}
              slug={data.slug}
              trackClear={handleTrackClear}
            />
          </Flex>
        }
        ListHeaderComponent={<HeaderArtworksFilterWithTotalArtworks onPress={handleFilterToggle} />}
        ListFooterComponent={
          !!isLoadingNext ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        renderItem={({ item, index, columnIndex }) => {
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
                contextScreenOwnerType={OwnerType.fair}
                contextScreenOwnerId={data.internalID}
                contextScreenOwnerSlug={data.slug}
                artwork={item}
                height={imgHeight}
              />
            </Flex>
          )
        }}
      />
      <ArtworkFilterNavigator
        visible={isFilterArtworksModalVisible}
        id={data.internalID}
        slug={data.slug}
        mode={FilterModalMode.Fair}
        exitModal={handleFilterToggle}
        closeModal={handleFilterToggle}
      />
    </>
  )
}

const fragment = graphql`
  fragment FairArtworks_fair on Fair
  @refetchable(queryName: "FairArtworksPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    slug
    internalID
    fairArtworks: filterArtworksConnection(
      first: $count
      after: $cursor
      aggregations: [
        ARTIST
        ARTIST_NATIONALITY
        COLOR
        DIMENSION_RANGE
        FOLLOWED_ARTISTS
        LOCATION_CITY
        MAJOR_PERIOD
        MATERIALS_TERMS
        MEDIUM
        PARTNER
        PRICE_RANGE
      ]
      input: $input
    ) @connection(key: "Fair_fairArtworks") {
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
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          id
          image(includeAll: false) {
            aspectRatio
          }
        }
      }
      counts {
        total
        followedArtists
      }
    }
  }
`

const tracks = {
  closeArtworksFilter: (fair: any) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
    context_screen: Schema.PageNames.FairPage,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openArtworksFilter: (fair: any) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
    context_screen: Schema.PageNames.FairPage,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  trackClear: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.ContextModules.ArtworkGrid,
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
