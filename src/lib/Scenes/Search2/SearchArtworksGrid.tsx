import { SearchArtworksGrid_viewer } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { SearchArtworksGridQuery } from "__generated__/SearchArtworksGridQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { getSelectedFiltersCounts } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderGrid } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, bullet, FilterIcon, Flex, Separator, Spacer, Text, TouchableHighlightColor } from "palette"
import React, { useMemo, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer
  relay: RelayPaginationProp
}

export const SEARCH_ARTWORKS_GRID_QUERY = graphql`
  query SearchArtworksGridQuery($count: Int!, $cursor: String, $keyword: String, $input: FilterArtworksInput) {
    viewer {
      ...SearchArtworksGrid_viewer @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
    }
  }
`

export const SearchArtworksGridQueryRenderer: React.FC<{ keyword: string }> = ({ keyword }) => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<SearchArtworksGridQuery>
        environment={defaultEnvironment}
        // tslint:disable-next-line:relay-operation-generics
        query={SEARCH_ARTWORKS_GRID_QUERY}
        render={renderWithPlaceholder({
          Container: SearchArtworksGridPaginationContainer,
          renderPlaceholder: () => <PlaceholderGrid />,
        })}
        variables={{ count: 20, keyword }}
        cacheConfig={{ force: true }}
      />
    </ArtworkFiltersStoreProvider>
  )
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)
  const artworksCount = viewer.artworks?.edges?.length
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const appliedFiltersCount = useMemo(
    () => Object.values(getSelectedFiltersCounts(appliedFilters)).reduce((prev, value) => prev + value, 0),
    [appliedFilters]
  )

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
        id={"artist.internalID"}
        slug={"artist.slug"}
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
        exitModal={handleCloseFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Artworks}
      />
      <Flex flexDirection="row" height={28} my={1} px={2} justifyContent="space-between" alignItems="center">
        <TouchableHighlightColor
          haptic
          onPress={handleOpenFilterArtworksModal}
          render={({ color }) => (
            <Flex flex={1} flexDirection="row" alignItems="center">
              <FilterIcon fill={color} width="20px" height="20px" />
              <Text variant="small" numberOfLines={1} color={color} ml={0.5}>
                Sort & Filter
              </Text>
              {appliedFiltersCount > 0 && (
                <Text variant="small" color="blue100">
                  {` ${bullet} ${appliedFiltersCount}`}
                </Text>
              )}
            </Flex>
          )}
        />
      </Flex>
      <Separator />
      {artworksCount === 0 ? (
        <Box mb="80px" pt={1}>
          {/* TODO: Change that with no results message for artwork grid??? Design? */}
          <Text>{`We couldn't find anything for`}</Text>
        </Box>
      ) : (
        <FlatList<ArtworkSection>
          data={content}
          contentContainerStyle={{ paddingTop: 20 }}
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
    query: SEARCH_ARTWORKS_GRID_QUERY,
  }
)
