import { Sans } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { ArtistCollectionsRailRenderer as ArtistCollectionsRail } from "./ArtistCollectionsRailRenderer"

interface Props extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  relay: RelayPaginationProp
}

const ArtworksGrid: React.FC<Props> = ({ artist, relay, ...props }) => (
  <StickyTabPageScrollView>
    <ArtistCollectionsRail artistID={artist.internalID} />
    <Sans size="4" mb={1}>
      All works
    </Sans>
    <InfiniteScrollArtworksGrid
      // @ts-ignore STRICTNESS_MIGRATION
      connection={artist.artworks}
      loadMore={relay.loadMore}
      {...props}
    />
  </StickyTabPageScrollView>
)

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        internalID
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          sort: "-decayed_merch"
          aggregations: [TOTAL]
        ) @connection(key: "ArtistArtworksGrid_artworks") {
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
      return props.artist && props.artist.artworks
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
      query ArtistArtworksQuery($id: ID!, $count: Int!, $cursor: String) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)
