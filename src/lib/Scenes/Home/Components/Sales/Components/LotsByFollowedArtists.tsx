import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import createEnvironment from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { get } from "lodash"
import React, { Component } from "react"
import { Button, Text, View } from "react-native"
import { RelayPaginationProp } from "react-relay"
import { createPaginationContainer, graphql, QueryRenderer, QueryRendererProps } from "react-relay"

const PAGE_SIZE = 2

interface RelayProps {
  relay: RelayPaginationProp
  sale_artworks: {
    connection: {
      pageInfo: {
        hasNextPage: boolean
      }
      edges: Array<{
        node: {
          artwork: {
            __id: string
            image: {
              aspect_ratio: number
            }
          }
        }
      }>
    }
  }
}

const Query = graphql.experimental`
  query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
    sale_artworks {
      ...LotsByFollowedArtists_sale_artworks @arguments(count: $count, cursor: $cursor)
    }
  }
`

const Pagination = createPaginationContainer(
  GridContainer,
  graphql.experimental`
    fragment LotsByFollowedArtists_sale_artworks on SaleArtworks
      @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" }) {
      connection(first: $count, after: $cursor) @connection(key: "LotsByFollowedArtists_connection") {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            artwork {
              ...GenericGrid_artworks
            }
          }
        }
      }
    }
  `,
  {
    getConnectionFromProps: ({ sale_artworks }) => sale_artworks && sale_artworks.connection,
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (props, { count, cursor }) => ({ count, cursor }),
    query: Query,
  }
)

export class LotsByFollowedArtists extends Component<any> {
  render() {
    return (
      <QueryRenderer
        environment={createEnvironment()}
        query={Query}
        variables={{
          count: PAGE_SIZE,
        }}
        render={renderWithLoadProgress(Pagination)}
      />
    )
  }
}

function GridContainer(props: RelayProps) {
  const artworks = get(props, "sale_artworks.connection.edges", []).map(({ node }) => node.artwork)

  return (
    <View>
      <Button title="Load More" onPress={() => props.relay.loadMore(PAGE_SIZE, x => x)} />
      <GenericGrid artworks={artworks} />
    </View>
  )
}
