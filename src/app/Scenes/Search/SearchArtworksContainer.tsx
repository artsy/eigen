import { SearchArtworksContainerQuery } from "__generated__/SearchArtworksContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { SearchArtworksGridPlaceholder } from "./components/placeholders/SearchArtworksGridPlaceholder"
import { SearchArtworksGridPaginationContainer } from "./SearchArtworksGrid"

export const SearchArtworksQueryRenderer: React.FC<{ keyword: string }> = ({ keyword }) => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<SearchArtworksContainerQuery>
        environment={defaultEnvironment}
        query={graphql`
          query SearchArtworksContainerQuery($count: Int!, $cursor: String, $keyword: String) {
            viewer {
              ...SearchArtworksGrid_viewer
                @arguments(count: $count, cursor: $cursor, keyword: $keyword)
            }
          }
        `}
        render={renderWithPlaceholder({
          Container: SearchArtworksGridPaginationContainer,
          renderPlaceholder: () => <SearchArtworksGridPlaceholder />,
          initialProps: { keyword },
          renderFallback: ({ retry }) => <LoadFailureView onRetry={retry!} />,
        })}
        variables={{ count: 20, keyword }}
        cacheConfig={{ force: true }}
      />
    </ArtworkFiltersStoreProvider>
  )
}
