import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MasonryFlashListRef, MasonryListRenderItem } from "@shopify/flash-list"
import { CollectionArtworks_collection$data } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { extractNodes } from "app/utils/extractNodes"
import { get } from "app/utils/get"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface CollectionArtworksProps {
  collection: CollectionArtworks_collection$data
  relay: RelayPaginationProp
}

export const CURATORS_PICKS_SLUGS = ["most-loved", "curators-picks"]

type Artworks = ExtractNodeType<CollectionArtworks_collection$data["collectionArtworks"]>

export const CollectionArtworks: React.FC<CollectionArtworksProps> = ({ collection, relay }) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const tracking = useTracking()
  const artworks = get(collection, (p) => p.collectionArtworks)
  const artworksTotal = artworks?.counts?.total

  const artworksList = useMemo(
    () => extractNodes(collection.collectionArtworks),
    [collection.collectionArtworks]
  )
  const gridRef = useRef<MasonryFlashListRef<(typeof artworksList)[0]>>(null)

  const scrollToTop = () => {
    gridRef?.current?.scrollToOffset({ offset: 0, animated: true })
  }

  useArtworkFilters({
    relay,
    aggregations: collection?.collectionArtworks?.aggregations,
    componentPath: "Collection/CollectionArtworks",
    pageSize: MASONRY_LIST_PAGE_SIZE,
    type: "sort",
    onApply: () => scrollToTop(),
  })

  const shouldDisplaySpinner =
    !!isLoading && !!artworksList.length && !!relay.isLoading() && !!relay.hasMore()

  const handleFilterOpen = () => {
    setFilterArtworkModalVisible(true)
  }

  const handleFilterClose = () => {
    setFilterArtworkModalVisible(false)
  }

  const loadMore = () => {
    if (relay.hasMore() && !relay.isLoading()) {
      // IMPORTANT: this is a workaround to show the spinner concistently between refetches of pages
      // and it is not needed for grids that use relay hooks since isLoadingNext works better than the
      // legacy container API. See FairArtworks.tsx for an example of how to use with relay hooks.
      setIsLoading(true)
      relay.loadMore(MASONRY_LIST_PAGE_SIZE, () => {
        setIsLoading(false)
      })
    }
  }

  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFiltersCountAction
  )
  const counts = ArtworksFiltersStore.useStoreState((state) => state.counts)

  useEffect(() => {
    // for use by CollectionArtworksFilter to keep count
    const filterCount = { ...counts, ...artworks?.counts }
    setFiltersCountAction(filterCount)
  }, [artworksTotal])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.Collection,
      context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const renderItem: MasonryListRenderItem<Artworks> = useCallback(
    ({ item, index, columnIndex }) => {
      const imgAspectRatio = item.image?.aspectRatio ?? 1
      const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
      const imgHeight = imgWidth / imgAspectRatio

      const hideSignals = CURATORS_PICKS_SLUGS.includes(collection.slug)

      return (
        <Flex
          pl={columnIndex === 0 ? 0 : 1}
          pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
          mt={2}
        >
          <ArtworkGridItem
            itemIndex={index}
            contextScreenOwnerType={OwnerType.collection}
            contextScreenOwnerId={collection.id}
            contextScreenOwnerSlug={collection.slug}
            artwork={item}
            height={imgHeight}
            hideCuratorsPickSignal={hideSignals}
            hideIncreasedInterestSignal={hideSignals}
          />
        </Flex>
      )
    },
    []
  )

  return (
    <>
      <Tabs.Masonry
        data={artworksList}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        innerRef={gridRef}
        ListEmptyComponent={
          <Box mb="80px" pt={2}>
            <FilteredArtworkGridZeroState
              id={collection.id}
              slug={collection.slug}
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
            <HeaderArtworksFilterWithTotalArtworks onPress={handleFilterOpen} />
          </Tabs.SubTabBar>
        }
        ListFooterComponent={
          <AnimatedMasonryListFooter shouldDisplaySpinner={shouldDisplaySpinner} />
        }
      />
      <ArtworkFilterNavigator
        id={collection.id}
        slug={collection.slug}
        visible={!!isFilterArtworksModalVisible}
        name={collection.title ?? ""}
        exitModal={handleFilterClose}
        closeModal={handleFilterClose}
        mode={FilterModalMode.ArtistArtworks}
      />
    </>
  )
}

export const CollectionArtworksFragmentContainer = createPaginationContainer(
  CollectionArtworks,
  {
    collection: graphql`
      fragment CollectionArtworks_collection on MarketingCollection
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        slug
        id
        title
        collectionArtworks: artworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            ARTIST
            ARTIST_NATIONALITY
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
          ]
          input: $input
        ) @connection(key: "Collection_collectionArtworks") {
          aggregations {
            slice
            counts {
              value
              name
              count
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
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.collection?.collectionArtworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.collection.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query CollectionArtworksInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        marketingCollection(slug: $id) {
          ...CollectionArtworks_collection @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
