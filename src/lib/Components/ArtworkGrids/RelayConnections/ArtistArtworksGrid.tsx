import { createPaginationContainer, graphql } from "react-relay/compat"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

import Artwork from "../Artwork"
// tslint:disable-next-line:no-unused-expression
// This is so that TypeScript won’t remove the seemingly unused `Artwork` import. Relay depends on it to exist.
Artwork

const ArtistArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    artist: graphql.experimental`
      fragment ArtistArtworksGrid_artist on Artist @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        filter: { type: "[ArtistArtworksFilters]" }
      ) {
        artworks: artworks_connection(
          first: $count
          after: $cursor
          filter: $filter
          sort: partner_updated_at_desc
        ) @connection(key: "ArtistArtworksGrid_artworks") {
          pageInfo{
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              __id
              image {
                aspect_ratio
              }
              ...Artwork_artwork
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.artist && props.artist.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    // FIXME: Replace hardcoded artistID
    query: graphql`
      query ArtistArtworksGridQuery(
        $count: Int!
        $cursor: String
        $filter: [ArtistArtworksFilters]
      ) {
        artist(id: "david-shrigley") {
          ...ArtistArtworksGrid_artist
        }
      }
    `,
  }
)

export default ArtistArtworksGrid

export interface ArtistRelayProps {
  artist: {
    artworks_connection: {
      pageInfo: {
        hasNextPage: boolean
      }
      edges: Array<{
        node: {
          __id: string
          image: {
            aspect_ratio: number | null
          } | null
        } | null
      }>
    } | null
  }
}
