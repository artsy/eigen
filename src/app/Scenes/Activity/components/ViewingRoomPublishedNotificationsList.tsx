import { Button, Flex } from "@artsy/palette-mobile"
import { ViewingRoomPublishedNotificationsList_viewingRoomsConnection$key } from "__generated__/ViewingRoomPublishedNotificationsList_viewingRoomsConnection.graphql"
import { ViewingRoomsListItem } from "app/Scenes/ViewingRoom/Components/ViewingRoomsListItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

interface ViewingRoomPublishedNotificationsList {
  viewingRoomsConnection?: ViewingRoomPublishedNotificationsList_viewingRoomsConnection$key | null
}

export const ViewingRoomPublishedNotificationsList: FC<ViewingRoomPublishedNotificationsList> = (
  props
) => {
  const viewingRoomsConnection = useFragment(
    viewingRoomPublishedNotificationsListFragment,
    props.viewingRoomsConnection
  )

  const viewingRooms = extractNodes(viewingRoomsConnection)

  return (
    <Flex flexDirection="column" alignItems="center">
      {viewingRooms.map((viewingRoom) => (
        <>
          <ViewingRoomsListItem key={viewingRoom.internalID} item={viewingRoom} />
          <Button
            mt={2}
            block
            onPress={() => {
              if (viewingRoom.slug) {
                navigate(`/viewing-room/${viewingRoom.slug}`)
              }
            }}
            accessibilityLabel="View Works"
          >
            View Works
          </Button>
        </>
      ))}
    </Flex>
  )
}

export const viewingRoomPublishedNotificationsListFragment = graphql`
  fragment ViewingRoomPublishedNotificationsList_viewingRoomsConnection on ViewingRoomsConnection {
    edges {
      node {
        internalID
        slug
        ...ViewingRoomsListItem_item
      }
    }
  }
`
