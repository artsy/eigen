import { Box, Sans } from "@artsy/palette"
import { ViewingRoomSubsections_viewingRoom } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface ViewingRoomSubsectionProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomSubsections_viewingRoom
}

export class ViewingRoomSubsections extends React.Component<ViewingRoomSubsectionProps> {
  render() {
    return (
      <Box>
        <Sans size="4">{this.props.viewingRoom.subsectionsConnection.edges[0].node.title}</Sans>
      </Box>
    )
  }
}

export const ViewingRoomSubsectionsContainer = createPaginationContainer(
  ViewingRoomSubsections,
  {
    viewingRoom: graphql`
      fragment ViewingRoomSubsections_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        subsectionsConnection(first: $count, after: $cursor)
          @connection(key: "ViewingRoomSubsections_subsectionsConnection") {
          edges {
            node {
              title
              body
              imageURL
              caption
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.viewingRoom.subsectionsConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        id: fragmentVariables.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query ViewingRoomSubsectionsQuery($id: ID!, $count: Int!, $cursor: String) {
        viewingRoom(id: $id) {
          ...ViewingRoomSubsections_viewingRoom @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
