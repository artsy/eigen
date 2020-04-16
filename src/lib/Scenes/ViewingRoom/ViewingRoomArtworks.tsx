import { Flex, Sans, Theme } from "@artsy/palette"
import { ViewingRoomArtworks_viewingRoom } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import { ViewingRoomArtworksRendererQuery } from "__generated__/ViewingRoomArtworksRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 32
interface ViewingRoomArtworksProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomArtworks_viewingRoom
}
// TODO: add tracking! For now this is just here because it crashes otherwise lol :/

@screenTrack(() => ({})) // tslint:disable-line
export class ViewingRoomArtworks extends React.Component<ViewingRoomArtworksProps> {
  render() {
    const viewingRoom = this.props.viewingRoom
    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <Sans size="4">Hiya</Sans>
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

export const ViewingRoomArtworksContainer = createPaginationContainer(
  // this is the component we're wrapping
  ViewingRoomArtworks,
  // this is the fragmentSpec, type GraphQLTaggedNode
  // from the docs: "specifies the data requirements for the component
  // via a GraphQL fragment"
  // Convention is that name is <FileName>_<propName>
  {
    viewingRoom: graphql`
      fragment ViewingRoomArtworks_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtworks_artworksConnection") {
          edges {
            node {
              href
              artistNames
              date
              image {
                url(version: "larger")
                aspectRatio
              }
              saleMessage
              title
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

// We'll eventually have this take in { viewingRoomID } as props and delete the hardcoded ID
export const ViewingRoomArtworksRenderer: React.SFC<{ viewingRoomID: string }> = () => {
  return (
    <QueryRenderer<ViewingRoomArtworksRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomArtworksRendererQuery($viewingRoomID: ID!) {
          viewingRoom(id: $viewingRoomID) {
            ...ViewingRoomArtworks_viewingRoom
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        viewingRoomID: "57df98ab-e39c-4681-b8ef-9b4d802afdac",
      }}
      render={renderWithLoadProgress(ViewingRoomArtworksContainer)}
    />
  )
}
