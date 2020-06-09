import { Sans } from "@artsy/palette"
import {
  ViewingRoomsList_viewingRooms,
  ViewingRoomsList_viewingRooms$key,
} from "__generated__/ViewingRoomsList_viewingRooms.graphql"
import { ViewingRoomsListItem_data } from "__generated__/ViewingRoomsListItem_data.graphql"
import { ViewingRoomsListItem_item } from "__generated__/ViewingRoomsListItem_item.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { FragmentDefinitionNode } from "graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import _ from "lodash"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { isPresent } from "ts-is-present"
import { ViewingRoomsListItemFragmentContainer } from "./Components/ViewingRoomsListItem"

interface ViewingRoomsListProps {
  viewingRooms: ViewingRoomsList_viewingRooms
}

const cleanUpData = (from: ViewingRoomsList_viewingRooms) => {
  if (from.edges === null || from.edges.length === 0) {
    return []
  }

  return from.edges.map(e => e?.node).filter(isPresent)
}

export const ViewingRoomsList: React.FC<ViewingRoomsListProps> = ({ viewingRooms }) => {
  const viewingRoomsData = cleanUpData(viewingRooms)

  return (
    <View style={{ flex: 1, backgroundColor: "green" }}>
      <Sans size="3t">List</Sans>
      <FlatList
        data={viewingRoomsData}
        renderItem={({ item }) => <ViewingRoomsListItemFragmentContainer item={item} />}
      />
    </View>
  )
}

export const ViewingRoomsListFragmentContainer = createFragmentContainer(ViewingRoomsList, {
  viewingRooms: graphql`
    fragment ViewingRoomsList_viewingRooms on ViewingRoomConnection {
      edges {
        node {
          ...ViewingRoomsListItem_item
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
          viewingRooms {
            ...ViewingRoomsList_viewingRooms
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(ViewingRoomsListFragmentContainer)}
    />
  )
}
