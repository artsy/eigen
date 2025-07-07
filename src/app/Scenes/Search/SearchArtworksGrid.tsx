import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, quoteLeft, quoteRight, Text } from "@artsy/palette-mobile"
import {
  SearchArtworksContainerQuery,
  SearchArtworksContainerQuery$data,
} from "__generated__/SearchArtworksContainerQuery.graphql"
import { SearchArtworksGrid_aggregations$key } from "__generated__/SearchArtworksGrid_aggregations.graphql"
import { SearchArtworksGrid_viewer$key } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE, SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useRefreshControl } from "app/utils/refreshHelpers"

import { Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import React, { useEffect, useState } from "react"

import { graphql, useFragment, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksContainerQuery$data["viewer"]
  keyword: string
}

export const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({
  viewer: viewerProp,
  keyword,
}) => {
  const { trackEvent } = useTracking()

  const {
    data: viewer,
    refetch,
    hasNext,
    loadNext,
    isLoadingNext,
  } = usePaginationFragment<SearchArtworksContainerQuery, SearchArtworksGrid_viewer$key>(
    paginationFragment,
    viewerProp
  )

  const aggregationsData = useFragment<SearchArtworksGrid_aggregations$key>(
    aggregationsFragment,
    viewerProp
  )

  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )
  const artworks = extractNodes(viewer.artworks)
  const artworksCount = viewer.artworks?.counts?.total ?? 0

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

  const appliedFiltersCount = useSelectedFiltersCount()

  useArtworkFilters({
    refetch,
    aggregations: aggregationsData.artworksWithAggregations?.aggregations,
    componentPath: "Search/SearchArtworksGrid",
  })

  useEffect(() => {
    if (viewer.artworks?.counts) {
      setFiltersCountAction({
        followedArtists: viewer.artworks.counts.followedArtists,
        total: null,
      })
    }
  }, [setFiltersCountAction, viewer.artworks?.counts])

  const RefreshControl = useRefreshControl(refetch)

  return (
    <Flex flex={1}>
      <ArtworkFilterNavigator
        query={keyword}
        visible={isFilterArtworksModalVisible}
        exitModal={() => handleCloseFilterArtworksModal(true)}
        closeModal={handleCloseFilterArtworksModal}
        mode={FilterModalMode.Search}
      />

      <ArtworksFilterHeader
        childrenPosition="left"
        onFilterPress={handleOpenFilterArtworksModal}
        selectedFiltersCount={appliedFiltersCount}
      >
        <Text variant="xs" color="mono60">
          {artworksCount} {artworksCount === 1 ? "Artwork" : "Artworks"}
        </Text>
        <Flex />
      </ArtworksFilterHeader>

      <Flex flex={1}>
        <MasonryInfiniteScrollArtworkGrid
          animated
          artworks={artworks}
          isLoading={isLoadingNext}
          loadMore={loadNext}
          hasMore={hasNext}
          numColumns={NUM_COLUMNS_MASONRY}
          disableAutoLayout
          pageSize={PAGE_SIZE}
          contextScreenOwnerType={OwnerType.search}
          contextScreenQuery={keyword}
          contextScreen={OwnerType.search}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Box pt={6}>
              <Box>
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
          refreshControl={RefreshControl}
          contentContainerStyle={{
            paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET,
          }}
        />
      </Flex>
    </Flex>
  )
}

const paginationFragment = graphql`
  fragment SearchArtworksGrid_viewer on Viewer
  @refetchable(queryName: "SearchArtworksGridRefetchQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    keyword: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    artworks: artworksConnection(first: $count, after: $cursor, keyword: $keyword, input: $input)
      @connection(key: "SearchArtworksGrid_artworks") {
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
`

const aggregationsFragment = graphql`
  fragment SearchArtworksGrid_aggregations on Viewer
  @argumentDefinitions(keyword: { type: "String" }) {
    artworksWithAggregations: artworksConnection(
      first: 0
      keyword: $keyword
      aggregations: [
        ARTIST
        MEDIUM
        MATERIALS_TERMS
        ARTIST_NATIONALITY
        LOCATION_CITY
        MAJOR_PERIOD
        PARTNER
        FOLLOWED_ARTISTS
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
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`

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
