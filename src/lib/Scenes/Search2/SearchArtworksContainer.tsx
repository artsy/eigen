import { SearchArtworksContainerQuery } from "__generated__/SearchArtworksContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderButton, PlaceholderGrid } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Spacer } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { SearchArtworksGridPaginationContainer } from "./SearchArtworksGrid"

export const SEARCH_ARTWORKS_QUERY = graphql`
  # TODO: revisit the name
  query SearchArtworksContainerQuery($count: Int!, $cursor: String, $keyword: String, $input: FilterArtworksInput) {
    viewer {
      ...SearchArtworksGrid_viewer @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
    }
  }
`

export const SearchArtworksQueryRenderer: React.FC<{ keyword: string }> = ({ keyword }) => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<SearchArtworksContainerQuery>
        environment={defaultEnvironment}
        // tslint:disable-next-line:relay-operation-generics
        query={SEARCH_ARTWORKS_QUERY}
        render={renderWithPlaceholder({
          Container: SearchArtworksGridPaginationContainer,
          renderPlaceholder: () => (
            <>
              <Flex height={28} flex={1} px={2} pt={0.5} my={2} flexDirection="row" alignItems="center">
                <PlaceholderButton width={20} height={20} />
                <PlaceholderButton marginLeft={5} width={70} height={20} />
              </Flex>
              <Spacer mt={0.9} mb={2} />
              <PlaceholderGrid />
            </>
          ),
        })}
        variables={{ count: 20, keyword }}
        cacheConfig={{ force: true }}
      />
    </ArtworkFiltersStoreProvider>
  )
}
