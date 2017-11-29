import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import createEnvironment from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React, { Component } from "react"
import { Text, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, QueryRendererProps } from "react-relay"

interface RelayProps {
  sale_artworks: {
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

const Query = graphql.experimental`
  query LotsByFollowedArtistsQuery {
    sale_artworks {
      ...LotsByFollowedArtists_sale_artworks
    }
  }
`

export class LotsByFollowedArtists extends Component<any> {
  render() {
    return (
      <QueryRenderer
        environment={createEnvironment()}
        query={Query}
        variables={{
          count: 5,
        }}
        render={renderWithLoadProgress(Pagination)}
      />
    )
  }
}

const Pagination = createPaginationContainer(
  GridContainer,
  graphql.experimental`
    fragment LotsByFollowedArtists_sale_artworks on SaleArtworksConnection {
      edges {
        node {
          artwork {
            __id
            image {
              aspect_ratio
            }
            ...Artwork_artwork @relay(mask: false)
          }
        }
      }
    }
  `,
  {
    direction: "forward",
    getConnectionFromProps: props => {
      return {}
    },
    getFragmentVariables: (prevVars, totalCount) => {
      return {}
    },
    getVariables: (props, { count, cursor }, fragmentVariables) => {
      return {}
    },
    query: Query,
  }
)

function GridContainer(props: RelayProps) {
  const { sale_artworks: { edges } } = props
  const artworks = edges.map(({ node }) => node.artwork)
  return <GenericGrid artworks={artworks} />
}
