import { SearchArtworksGrid_viewer } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { useArtworkFilters, useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"

import { OwnerType } from "@artsy/cohesion"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader2"
import { Schema } from "lib/utils/track"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { Box, Separator, Text, useTheme } from "palette"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer
  relay: RelayPaginationProp
  keyword: string
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay, keyword }) => {
  const { space } = useTheme()
  const { trackEvent } = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions((state) => state.setFiltersCountAction)

  const handleCloseFilterArtworksModal = () => {
    trackEvent(tracks.closeFilterModal())
    setFilterArtworkModalVisible(false)
  }
  const handleOpenFilterArtworksModal = () => {
    trackEvent(tracks.openFilterModal())
    setFilterArtworkModalVisible(true)
  }

  const artworksCount = viewer.artworks?.edges?.length
  const appliedFiltersCount = useSelectedFiltersCount()

  useArtworkFilters({
    relay,
    aggregations: viewer.artworks?.aggregations,
    componentPath: "Search2/SearchArtworksGrid",
  })

  useEffect(() => {
    if (viewer.artworks?.counts) {
      setFiltersCountAction({ followedArtists: viewer.artworks.counts.followedArtists, total: null })
    }
  }, [setFiltersCountAction])

  const content: ArtworkSection[] = [
    {
      key: "ARTWORKS",
      content: (
        <InfiniteScrollArtworksGridContainer
          shouldAddPadding
          connection={viewer.artworks!}
          loadMore={relay.loadMore}
          hasMore={relay.hasMore}
          updateRecentSearchesOnTap
          contextScreenOwnerType={OwnerType.search}
          contextScreenQuery={keyword}
          contextScreen={Schema.PageNames.Search}
        />
      ),
    },
  ]
  return (
    <>
      <ArtworkFilterNavigator
        id={null}
        slug={null}
        query={keyword}
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
        exitModal={handleCloseFilterArtworksModal}
        closeModal={handleCloseFilterArtworksModal}
        mode={FilterModalMode.Search}
      />
      <ArtworksFilterHeader selectedFiltersCount={appliedFiltersCount} onFilterPress={handleOpenFilterArtworksModal} />
      <Separator />
      {artworksCount === 0 ? (
        <Box mb="80px" pt={6}>
          <Box px={2}>
            <Text variant="md" textAlign="center">
              Sorry, we couldn’t find any Artworks for “{keyword}.”
            </Text>
            <Text variant="md" color="black60" textAlign="center">
              Please try searching again with a different spelling.
            </Text>
          </Box>
        </Box>
      ) : (
        <FlatList<ArtworkSection>
          data={content}
          contentContainerStyle={{ paddingTop: space(2) }}
          renderItem={({ item }) => item.content}
          keyExtractor={({ key }) => key}
        />
      )}
    </>
  )
}

export const SearchArtworksGridPaginationContainer = createPaginationContainer(
  SearchArtworksGrid,
  {
    viewer: graphql`
      fragment SearchArtworksGrid_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
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
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
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
      query SearchArtworksGridQuery($count: Int!, $cursor: String, $keyword: String, $input: FilterArtworksInput) {
        viewer {
          ...SearchArtworksGrid_viewer @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
        }
      }
    `,
  }
)

const tracks = {
  openFilterModal: () => ({
    action: "openFilterModal",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
  }),
  closeFilterModal: () => ({
    action: "closeFilterModal",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
  }),
}
