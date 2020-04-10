import { Box, Sans } from "@artsy/palette"
import { ViewingRoomArtworks_viewingRoom } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface ViewingRoomArtworkProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomArtworks_viewingRoom
}

export class ViewingRoomArtworks extends React.Component<ViewingRoomArtworkProps> {
  render() {
    const artworks = this.props.viewingRoom.artworksConnection.edges
    return (
      <StickyTabPageScrollView>
        {artworks.map((artwork, index) => {
          return (
            <Box key={index}>
              <ImageView
                imageURL={artwork.node.artwork.image.url}
                aspectRatio={artwork.node.artwork.image.aspectRatio}
              />
              <Box mt="2" mb="3">
                <Sans size="3t" weight="medium">
                  {artwork.node.artwork.artistNames}
                </Sans>
                <Sans size="3t" color="black60">
                  {artwork.node.artwork.title}
                </Sans>
                <Sans size="3t" color="black60">
                  {artwork.node.artwork.saleMessage}
                </Sans>
              </Box>
            </Box>
          )
        })}
      </StickyTabPageScrollView>
    )
  }
}

export const ViewingRoomArtworksContainer = createPaginationContainer(
  // this is the component we're wrapping
  ViewingRoomArtworks,
  // this is the fragmentSpec, type GraphQLTaggedNode
  // from the docs: "specifies the data requirements for the component
  // via a GraphQL fragment"
  // Conventino is that name is <FileName>_<propName>
  {
    viewingRoom: graphql`
      fragment ViewingRoomArtworks_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtworks_artworksConnection") {
          edges {
            node {
              artwork {
                artistNames
                date
                image {
                  url(version: "larger")
                  aspectRatio
                }
                saleMessage
                slug
                title
              }
            }
          }
        }
      }
    `,
  },
  // and this is the connectionConfig
  {
    // indicates which connection to paginate over, given the props corresponding to the fragmentSpec
    getConnectionFromProps(props) {
      return props.viewingRoom.artworksConnection
    },
    // "returns the variables to pass to the pagination query when fetching it from the server"
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        id: fragmentVariables.internalID,
        count,
        cursor,
      }
    },
    // oh this is also a GraphQLTaggedNode, same as fragmentSpec -
    // this is the actual query being run then, yeah?
    // rather, it's the query being fetched upon calling loadMore
    query: graphql`
      query ViewingRoomArtworksQuery($id: ID!, $count: Int!, $cursor: String) {
        viewingRoom(id: $id) {
          ...ViewingRoomArtworks_viewingRoom @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
