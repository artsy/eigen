import { Sans } from "@artsy/palette"
import { ViewingRoomsList_viewingRooms } from "__generated__/ViewingRoomsList_viewingRooms.graphql"
import { ViewingRoomsListItem_data } from "__generated__/ViewingRoomsListItem_data.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomsListItemFragmentContainer } from "./Components/ViewingRoomsListItem"

interface ViewingRoomsListProps {
  viewingRooms: ViewingRoomsList_viewingRooms
}

export const ViewingRoomsList: React.FC<ViewingRoomsListProps> = ({ viewingRooms }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "green" }}>
      <Sans size="3t">List</Sans>
      <FlatList data={viewingRooms} renderItem={({ item }) => <ViewingRoomsListItemFragmentContainer data={item} />} />
    </View>
  )
}

export const ViewingRoomsListFragmentContainer = createFragmentContainer(ViewingRoomsList, {
  viewingRooms: graphql`
    fragment ViewingRoomsList_viewingRooms on Query {
      viewingRooms {
        edges {
          node {
            ...ViewingRoomsListItem_data
          }
        }
      }
    }
  `,
})

export const ViewingRoomsListQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<ViewingRoomsListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomsListQuery {
          ...ViewingRoomsList_viewingRooms
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(ViewingRoomsListFragmentContainer)}
    />
  )
}
