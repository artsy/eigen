import { OwnerType } from "@artsy/cohesion"
import { Fair2Artworks_fair } from "__generated__/Fair2Artworks_fair.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Box } from "palette"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface Fair2ArtworksProps {
  fair: Fair2Artworks_fair
  relay: RelayPaginationProp
}

export const Fair2Artworks: React.FC<Fair2ArtworksProps> = ({ fair, relay }) => {
  const artworks = fair.fairArtworks!

  if ((artworks?.counts?.total ?? 0) === 0) {
    return null
  }

  return (
    <Box mb={3}>
      <InfiniteScrollArtworksGridContainer
        connection={artworks}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        isLoading={relay.isLoading}
        autoFetch={false}
        pageSize={20}
        contextScreenOwnerType={OwnerType.fair}
        contextScreenOwnerId={fair.internalID}
        contextScreenOwnerSlug={fair.slug}
      />
    </Box>
  )
}

export const Fair2ArtworksFragmentContainer = createPaginationContainer(
  Fair2Artworks,
  {
    fair: graphql`
      fragment Fair2Artworks_fair on Fair
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        sort: { type: "String", defaultValue: "-decayed_merch" }
      ) {
        slug
        internalID
        fairArtworks: filterArtworksConnection(first: 20, sort: $sort, after: $cursor)
        @connection(key: "Fair_fairArtworks") {
          edges {
            node {
              id
            }
          }
          counts {
            total
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.fair.fairArtworks
    },
    getFragmentVariables(previousVariables, count) {
      // Relay is unable to infer this for this component, I'm not sure why.
      return {
        ...previousVariables,
        count,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        props,
        count,
        cursor,
        id: props.fair.slug,
      }
    },
    query: graphql`
      query Fair2ArtworksInfiniteScrollGridQuery($id: String!, $count: Int!, $cursor: String, $sort: String) {
        fair(id: $id) {
          ...Fair2Artworks_fair @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
