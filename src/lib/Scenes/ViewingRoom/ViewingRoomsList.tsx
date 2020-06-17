import { Flex, Sans, Separator, Theme } from "@artsy/palette"
import { ViewingRoomsList_viewingRooms } from "__generated__/ViewingRoomsList_viewingRooms.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import _ from "lodash"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomsListItemFragmentContainer } from "./Components/ViewingRoomsListItem"

interface ViewingRoomsListProps {
  viewingRooms: ViewingRoomsList_viewingRooms
}

export const ViewingRoomsList: React.FC<ViewingRoomsListProps> = props => {
  const viewingRooms = extractNodes(props.viewingRooms)
  const viewingRoomsToDisplay = viewingRooms.filter(vr => vr.status === "live" || vr.status === "scheduled")

  return (
    <Theme>
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <View>
          <Sans size="4t" textAlign="center" mb={1} mt={2}>
            Viewing Rooms
          </Sans>
          <Separator />
          <FlatList
            data={viewingRoomsToDisplay}
            renderItem={({ item }) => <ViewingRoomsListItemFragmentContainer item={item} />}
          />
        </View>
      </Flex>
    </Theme>
  )
}

export const ViewingRoomsListFragmentContainer = createFragmentContainer(ViewingRoomsList, {
  viewingRooms: graphql`
    fragment ViewingRoomsList_viewingRooms on ViewingRoomConnection {
      edges {
        node {
          status
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
