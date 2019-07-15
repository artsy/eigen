import { ArtistNotForSaleArtworksGrid_artist } from "__generated__/ArtistNotForSaleArtworksGrid_artist.graphql"
import InfiniteScrollArtworksGrid, {
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { createPaginationContainer, graphql } from "react-relay"

const ArtistNotForSaleArtworksGrid = createPaginationContainer<
  { artist: ArtistNotForSaleArtworksGrid_artist } & InfiniteScrollGridProps
>(
  InfiniteScrollArtworksGrid as any,
  {
    artist: graphql`
      fragment ArtistNotForSaleArtworksGrid_artist on Artist
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          filter: { type: "[ArtistArtworksFilters]", defaultValue: [IS_NOT_FOR_SALE] }
        ) {
        id
        notForSaleArtworks: artworks_connection(
          first: $count
          after: $cursor
          filter: $filter
          sort: PARTNER_UPDATED_AT_DESC
        ) @connection(key: "ArtistNotForSaleArtworksGrid_notForSaleArtworks") {
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
                aspect_ratio
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
      return props.artist && props.artist.notForSaleArtworks
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
      query ArtistNotForSaleArtworksGridQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $filter: [ArtistArtworksFilters]
      ) {
        node(id: $id) {
          ... on Artist {
            ...ArtistNotForSaleArtworksGrid_artist @arguments(count: $count, cursor: $cursor, filter: $filter)
          }
        }
      }
    `,
  }
)

export default ArtistNotForSaleArtworksGrid
