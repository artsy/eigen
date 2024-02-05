import { Flex, Text } from "@artsy/palette-mobile"
import { ViewingRoomPublishedNotificationsList_viewingRoomsConnection$key } from "__generated__/ViewingRoomPublishedNotificationsList_viewingRoomsConnection.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

interface NotificationViewingRoomListProps {
  viewingRoomsConnection?: ViewingRoomPublishedNotificationsList_viewingRoomsConnection$key | null
}

export const NotificationViewingRoomsList: FC<NotificationViewingRoomListProps> = (props) => {
  const viewingRoomsConnection = useFragment(
    viewingRoomPublishedNotificationsListFragment,
    props.viewingRoomsConnection
  )

  const viewingRooms = extractNodes(viewingRoomsConnection)

  console.warn(props.viewingRoomsConnection)
  return (
    <Flex flexDirection="column" alignItems="center">
      <Text backgroundColor="pink"> {viewingRooms.length}</Text>
      {viewingRooms.map((viewingRoom) => (
        <Text key={viewingRoom.internalID}>{viewingRoom.title}</Text>
        /* <NotificationViewingRoom
          key={viewingRoom.internalID}
          viewingRoom={viewingRoom}
          contextModule={ContextModule.activity}
        /> */
      ))}
    </Flex>
  )
}

export const viewingRoomPublishedNotificationsListFragment = graphql`
  fragment ViewingRoomPublishedNotificationsList_viewingRoomsConnection on ViewingRoomsConnection {
    edges {
      node {
        internalID
        title
      }
    }
  }
`
// ...ViewingRoomPublishedNotification_viewingRoom
