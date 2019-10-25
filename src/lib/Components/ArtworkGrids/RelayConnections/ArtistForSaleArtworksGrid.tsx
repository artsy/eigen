import { ArtistForSaleArtworksGrid_artist } from "__generated__/ArtistForSaleArtworksGrid_artist.graphql"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props extends InfiniteScrollGridProps {
  artist: ArtistForSaleArtworksGrid_artist
  relay: RelayPaginationProp
}

const ArtistForSaleArtworksGrid: React.FC<Props> = ({ artist, relay, ...props }) => (
  <InfiniteScrollArtworksGrid connection={artist.forSaleArtworks} loadMore={relay.loadMore} {...props} />
)

export const ArtistForSaleArtworksGridContainer = createPaginationContainer(
  ArtistForSaleArtworksGrid,
  {
    artist: graphql`
      fragment ArtistForSaleArtworksGrid_artist on Artist
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        forSaleArtworks: filterArtworksConnection(
          first: $count
          after: $cursor
          forSale: true
          sort: "-decayed_merch"
          aggregations: [TOTAL]
        ) @connection(key: "ArtistForSaleArtworksGrid_forSaleArtworks") {
          # TODO: Just here to satisfy the relay compiler, can we get rid of this need?
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
      query ArtistForSaleArtworksGridQuery($id: ID!, $count: Int!, $cursor: String) {
        node(id: $id) {
          ... on Artist {
            ...ArtistForSaleArtworksGrid_artist @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)
