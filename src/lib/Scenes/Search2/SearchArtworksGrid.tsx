import { SearchArtworksGridQuery } from "__generated__/SearchArtworksGridQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex } from "palette"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer } from "react-relay"

const SearchArtworksGrid = (props: any) => {
  return (
    <Flex p={2} pb={0}>
      <InfiniteScrollArtworksGridContainer connection={props?.artworksConnection ?? null} {...props} />
    </Flex>
  )
}

export const SearchArtworksGridQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<SearchArtworksGridQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SearchArtworksGridQuery {
          artworksConnection(first: 10) {
            edges {
              node {
                id
                image {
                  aspect_ratio: aspectRatio
                }
                ...ArtworkGridItem_artwork
              }
            }
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: SearchArtworksGridContainer,
        renderPlaceholder: () => <SearchArtworksGrid />,
      })}
      variables={{}}
      cacheConfig={{ force: true }}
    />
  )
}

export const SearchArtworksGridContainer = createRefetchContainer(
  SearchArtworksGrid,
  {
    artworks: graphql`
      fragment SearchArtworksGrid_artworks on Artwork @relay(plural: true) {
        id
        image {
          aspect_ratio: aspectRatio
        }
        ...ArtworkGridItem_artwork
      }
    `,
  },
  graphql`
    query SearchArtworksGridRefetchQuery {
      artworksConnection(first: 10) {
        edges {
          node {
            ...SearchArtworksGrid_artworks
          }
        }
      }
    }
  `
)
