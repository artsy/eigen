import { Button, Flex } from "@artsy/palette-mobile"
import { ViewingRoomPublishedNotificationsList_viewingRoomsConnection$key } from "__generated__/ViewingRoomPublishedNotificationsList_viewingRoomsConnection.graphql"
import { ViewingRoomsListItem } from "app/Scenes/ViewingRoom/Components/ViewingRoomsListItem"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

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
        <Flex key={viewingRoom.internalID}>
          <ViewingRoomsListItem key={viewingRoom.internalID} item={viewingRoom} />

          <Flex mt={2} mb={4}>
            <RouterLink
              hasChildTouchable
              to={viewingRoom.slug ? `/viewing-room/${viewingRoom.slug}` : undefined}
            >
              <Button block accessibilityLabel="View Works">
                View Works
              </Button>
            </RouterLink>
          </Flex>
        </Flex>
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
