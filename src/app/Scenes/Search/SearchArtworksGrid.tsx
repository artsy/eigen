import { OwnerType } from "@artsy/cohesion"
import {
  Box,
  Flex,
  quoteLeft,
  quoteRight,
  Spinner,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { MasonryFlashList } from "@shopify/flash-list"
import { SearchArtworksGrid_viewer$data } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"

import { Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import React, { useCallback, useEffect, useState } from "react"

import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer$data
  relay: RelayPaginationProp
  keyword: string
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay, keyword }) => {
  const { space } = useTheme()
  const { trackEvent } = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const artworks = extractNodes(viewer.artworks)
  const artworksCount = viewer.artworks?.counts?.total ?? 0
  const { width } = useScreenDimensions()

  const shouldDisplaySpinner = !!artworks.length && !!relay.isLoading() && !!relay.hasMore()

  const handleCloseFilterArtworksModal = (withFiltersApplying = false) => {
    if (!withFiltersApplying) {
      trackEvent(tracks.closeFilterModal())
    }
    setFilterArtworkModalVisible(false)
  }
  const handleOpenFilterArtworksModal = () => {
    trackEvent(tracks.openFilterModal())
    setFilterArtworkModalVisible(true)
  }

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(10)
    }
  }, [relay.hasMore(), relay.isLoading()])

  const appliedFiltersCount = useSelectedFiltersCount()

  useArtworkFilters({
    relay,
    aggregations: viewer.artworks?.aggregations,
    componentPath: "Search/SearchArtworksGrid",
  })

  useEffect(() => {
    if (viewer.artworks?.counts) {
      setFiltersCountAction({
        followedArtists: viewer.artworks.counts.followedArtists,
        total: null,
      })
    }
  }, [setFiltersCountAction])

  return (
    <>
      <ArtworkFilterNavigator
        query={keyword}
        visible={isFilterArtworksModalVisible}
        exitModal={() => handleCloseFilterArtworksModal(true)}
        closeModal={handleCloseFilterArtworksModal}
        mode={FilterModalMode.Search}
      />

      {/* <Flex flexDirection="row" justifyContent="space-between" alignItems="center"> */}
      <ArtworksFilterHeader
        childrenPosition="left"
        onFilterPress={handleOpenFilterArtworksModal}
        selectedFiltersCount={appliedFiltersCount}
      >
        <Text variant="xs" color="mono60">
          {artworksCount} {artworksCount === 1 ? "Artwork" : "Artworks"}
        </Text>
      </ArtworksFilterHeader>
      {/* </Flex> */}

      <Flex flex={1} justifyContent="center" mx={2}>
        <MasonryFlashList
          showsVerticalScrollIndicator={false}
          data={artworks}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS_MASONRY}
          // this number is the estimated size of the artworkGridItem component
          estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <Box mb="80px" pt={6}>
              <Box px={2}>
                <Text variant="sm-display" textAlign="center">
                  Sorry, we couldn’t find any Artworks for {quoteLeft}
                  {keyword}.{quoteRight}
                </Text>
                <Text variant="sm-display" color="mono60" textAlign="center">
                  Please try searching again with a different spelling.
                </Text>
              </Box>
            </Box>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
          ListFooterComponent={
            shouldDisplaySpinner ? (
              <Flex my={4} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            ) : null
          }
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
                  contextScreenOwnerType={OwnerType.search}
                  contextScreenQuery={keyword}
                  contextScreen={Schema.PageNames.Search}
                  artwork={item}
                  height={imgHeight}
                />
              </Flex>
            )
          }}
        />
      </Flex>
    </>
  )
}

export const SearchArtworksGridPaginationContainer = createPaginationContainer(
  SearchArtworksGrid,
  {
    viewer: graphql`
      fragment SearchArtworksGrid_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        keyword: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworks: artworksConnection(
          first: $count
          after: $cursor
          keyword: $keyword
          aggregations: [
            ARTIST
            MEDIUM
            PRICE_RANGE
            DIMENSION_RANGE
            MATERIALS_TERMS
            ARTIST_NATIONALITY
            LOCATION_CITY
            MAJOR_PERIOD
            COLOR
            PARTNER
            FOLLOWED_ARTISTS
          ]
          input: $input
        ) @connection(key: "SearchArtworksGrid_artworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          counts {
            followedArtists
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
      return props.viewer && props.viewer.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query SearchArtworksGridQuery(
        $count: Int!
        $cursor: String
        $keyword: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...SearchArtworksGrid_viewer
            @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
        }
      }
    `,
  }
)

const tracks = {
  openFilterModal: () => ({
    action_name: "filter",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterModal: () => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
    action_type: Schema.ActionTypes.Tap,
  }),
}
