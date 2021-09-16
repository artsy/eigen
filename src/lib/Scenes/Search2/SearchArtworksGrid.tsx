import { SearchArtworksGrid_viewer } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { useArtworkFilters, useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"

import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader2"
import { Box, Separator, useTheme } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer
  relay: RelayPaginationProp
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay }) => {
  const { space } = useTheme()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)
  const artworksCount = viewer.artworks?.edges?.length

  const appliedFiltersCount = useSelectedFiltersCount()

  useArtworkFilters({
    relay,
    aggregations: viewer.aggregations?.aggregations,
    componentPath: "Search2/SearchArtworksGrid",
  })

  const closeFilterArtworksModal = () => {
    handleCloseFilterArtworksModal()
  }

  const content: ArtworkSection[] = [
    {
      key: "ARTWORKS",
      content: (
        <InfiniteScrollArtworksGridContainer
          shouldAddPadding
          connection={viewer.artworks!}
          loadMore={relay.loadMore}
          hasMore={relay.hasMore}
        />
      ),
    },
  ]

  return (
    <>
      <ArtworkFilterNavigator
        // TODO: use appropriate id and slug for our case
        id={"artist.internalID"}
        slug={"artist.slug"}
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
        exitModal={handleCloseFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Artworks}
      />
      <ArtworksFilterHeader selectedFiltersCount={appliedFiltersCount} onFilterPress={handleOpenFilterArtworksModal} />
      <Separator />
      {artworksCount === 0 ? (
        <Box mb="80px" pt={1}>
          <Box mb="80px" pt={1}>
            <FilteredArtworkGridZeroState
              // TODO: use appropriate id and slug for our case same as above
              id={"artist.id"}
              slug={"artist.slug"}
            />
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
        aggregations: artworksConnection(
          first: 0
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
        artworks: artworksConnection(first: $count, after: $cursor, keyword: $keyword, input: $input)
          @connection(key: "SearchArtworksGrid_artworks") {
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
