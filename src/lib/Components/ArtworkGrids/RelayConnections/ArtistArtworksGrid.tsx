import * as React from "react"
import * as Relay from "react-relay"
import Artwork from "../Artwork"

import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

export default Relay.createContainer(InfiniteScrollArtworksGrid, {
  initialVariables: {
    totalSize: PageSize,
    filter: null,
  },
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        artworks: artworks_connection(sort: partner_updated_at_desc, filter: $filter, first: $totalSize) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              __id
              image {
                aspect_ratio
              }
              ${Artwork.getFragment("artwork")}
            }
          }
        }
      }
    `,
  },
})

export interface ArtistRelayProps {
  artist: {
    artworks_connection: {
      pageInfo: {
        hasNextPage: boolean
      }
      edges: Array<
        {
          node: {
            __id: string
            image: {
              aspect_ratio: number | null
            } | null
          } | null
        }
      >
    } | null
  }
}
