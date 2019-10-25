import { ArtistNotForSaleArtworksGrid_artist } from "__generated__/ArtistNotForSaleArtworksGrid_artist.graphql"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props extends InfiniteScrollGridProps {
  artist: ArtistNotForSaleArtworksGrid_artist
  relay: RelayPaginationProp
  children: never
}

const ArtistNotForSaleArtworksGrid: React.FC<Props> = ({ artist, relay, ...props }) => (
  <InfiniteScrollArtworksGrid connection={artist.notForSaleArtworks} loadMore={relay.loadMore} {...props} />
)

export const ArtistNotForSaleArtworksGridContainer = createPaginationContainer(
  ArtistNotForSaleArtworksGrid,
  {
    artist: graphql`
      fragment ArtistNotForSaleArtworksGrid_artist on Artist
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          filter: { type: "[ArtistArtworksFilters]", defaultValue: [IS_NOT_FOR_SALE] }
        ) {
        id
        notForSaleArtworks: filterArtworksConnection(
          first: $count
          after: $cursor
          forSale: false
          sort: "-decayed_merch"
          aggregations: [TOTAL]
        ) @connection(key: "ArtistNotForSaleArtworksGrid_notForSaleArtworks") {
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
      query ArtistNotForSaleArtworksGridQuery($id: ID!, $count: Int!, $cursor: String) {
        node(id: $id) {
          ... on Artist {
            ...ArtistNotForSaleArtworksGrid_artist @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)
