import { SearchArtworksGrid_viewer } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { SearchArtworksGridQuery } from "__generated__/SearchArtworksGridQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderGrid } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer
  relay: RelayPaginationProp
}

export const SEARCH_ARTWORKS_GRID_QUERY = graphql`
  query SearchArtworksGridQuery($count: Int!, $cursor: String, $keyword: String) {
    viewer {
      ...SearchArtworksGrid_viewer @arguments(count: $count, cursor: $cursor, keyword: $keyword)
    }
  }
`

export const SearchArtworksGridQueryRenderer: React.FC<{ keyword: string }> = ({ keyword }) => {
  return (
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
  )
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay }) => {
  const content: ArtworkSection[] = [
    {
      key: "ARTWORKS",
      content: (
        <InfiniteScrollArtworksGridContainer
          connection={viewer.artworksConnection!}
          loadMore={relay.loadMore}
          hasMore={relay.hasMore}
        />
      ),
    },
  ]

  return (
    <FlatList<ArtworkSection>
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      data={content}
      renderItem={({ item }) => item.content}
      keyExtractor={({ key }) => key}
    />
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
      ) {
        artworksConnection(first: $count, after: $cursor, keyword: $keyword)
          @connection(key: "SearchArtworksGrid_artworksConnection") {
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
      return props.viewer && props.viewer.artworksConnection
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
