import { SearchArtworksContainerQuery } from "__generated__/SearchArtworksContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderButton, PlaceholderGrid } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Separator } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { SearchArtworksGridPaginationContainer } from "../SearchArtworksGrid"

export const SearchArtworksQueryRenderer: React.FC<{ keyword: string }> = ({ keyword }) => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<SearchArtworksContainerQuery>
        environment={defaultEnvironment}
        query={graphql`
          query SearchArtworksContainerQuery($count: Int!, $cursor: String, $keyword: String) {
            viewer {
              ...SearchArtworksGrid_viewer @arguments(count: $count, cursor: $cursor, keyword: $keyword)
            }
          }
        `}
        render={renderWithPlaceholder({
          Container: SearchArtworksGridPaginationContainer,
          renderPlaceholder: () => <SearchArtworksGridSkeleton />,
          renderFallback: ({ retry }) => <LoadFailureView onRetry={retry!} />,
        })}
        variables={{ count: 20, keyword }}
        cacheConfig={{ force: true }}
      />
    </ArtworkFiltersStoreProvider>
  )
}

const SearchArtworksGridSkeleton: React.FC = () => (
  <Flex accessibilityLabel="Search artworks are loading">
    <Flex height={28} my={1} px={2} justifyContent="space-between">
      <Flex flex={1} flexDirection="row">
        <PlaceholderButton width={20} height={20} />
        <PlaceholderButton marginLeft={5} width={70} height={20} />
      </Flex>
    </Flex>
    <Separator mb={2} />
    <PlaceholderGrid />
  </Flex>
)
