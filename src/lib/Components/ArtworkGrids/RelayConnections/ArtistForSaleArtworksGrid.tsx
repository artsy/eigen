import { ArtistForSaleArtworksGrid_artist } from "__generated__/ArtistForSaleArtworksGrid_artist.graphql"
import InfiniteScrollArtworksGrid, {
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { createPaginationContainer, graphql } from "react-relay"

const ArtistForSaleArtworksGrid = createPaginationContainer<
  { artist: ArtistForSaleArtworksGrid_artist } & InfiniteScrollGridProps
>(
  InfiniteScrollArtworksGrid as any,
  {
    artist: graphql`
      fragment ArtistForSaleArtworksGrid_artist on Artist
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          filter: { type: "[ArtistArtworksFilters]", defaultValue: [IS_FOR_SALE] }
        ) {
        id
        forSaleArtworks: artworksConnection(
          first: $count
          after: $cursor
          filter: $filter
          sort: PARTNER_UPDATED_AT_DESC
        ) @connection(key: "ArtistForSaleArtworksGrid_forSaleArtworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              slug
              id
              image {
                aspect_ratio: aspectRatio
              }
              ...ArtworkGridItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.artist && props.artist.forSaleArtworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, { filter }) {
      return {
        id: props.artist.id,
        count,
        cursor,
        filter,
      }
    },
    query: graphql`
      query ArtistForSaleArtworksGridQuery($id: ID!, $count: Int!, $cursor: String, $filter: [ArtistArtworksFilters]) {
        node(id: $id) {
          ... on Artist {
            ...ArtistForSaleArtworksGrid_artist @arguments(count: $count, cursor: $cursor, filter: $filter)
          }
        }
      }
    `,
  }
)

export default ArtistForSaleArtworksGrid
