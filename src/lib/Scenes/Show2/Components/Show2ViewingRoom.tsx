import { ActionType, ContextModule, OwnerType, TappedViewingRoomCard } from "@artsy/cohesion"
import { Show2ViewingRoom_show } from "__generated__/Show2ViewingRoom_show.graphql"
import { navigate } from "lib/navigation/navigate"
import { tagForStatus } from "lib/Scenes/ViewingRoom/Components/ViewingRoomsListItem"
import { Box, BoxProps, MediumCard } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface Show2ViewingRoomProps extends BoxProps {
  show: Show2ViewingRoom_show
}

export const Show2ViewingRoom: React.FC<Show2ViewingRoomProps> = ({ show, ...rest }) => {
  const tracking = useTracking()

  const viewingRoom = show.viewingRoomsConnection?.edges?.[0]?.node

  if (!viewingRoom) {
    return null
  }

  const handlePress = () => {
    navigate(viewingRoom.href!)

    const data: TappedViewingRoomCard = {
      action: ActionType.tappedViewingRoomCard,
      context_module: ContextModule.associatedViewingRoom,
      context_screen_owner_type: OwnerType.show,
      context_screen_owner_id: show.internalID,
      context_screen_owner_slug: show.slug,
      destination_screen_owner_type: OwnerType.viewingRoom,
      destination_screen_owner_id: viewingRoom.internalID,
      destination_screen_owner_slug: viewingRoom.slug,
      type: "thumbnail",
    }

    tracking.trackEvent(data)
  }

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={handlePress}>
        <MediumCard
          width="100%"
          height="auto"
          title={viewingRoom.title}
          subtitle={show.partner?.name ?? undefined}
          image={viewingRoom.image?.imageURLs?.normalized ?? ""}
          tag={tagForStatus(viewingRoom.status, viewingRoom.distanceToOpen, viewingRoom.distanceToClose)}
          style={{ aspectRatio: 3 / 4 }}
        />
      </TouchableOpacity>
    </Box>
  )
}

export const Show2ViewingRoomFragmentContainer = createFragmentContainer(Show2ViewingRoom, {
  show: graphql`
    fragment Show2ViewingRoom_show on Show {
      internalID
      slug
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      viewingRoomsConnection {
        edges {
          node {
            internalID
            slug
            title
            status
            distanceToOpen(short: true)
            distanceToClose(short: true)
            href
            image {
              imageURLs {
                normalized
              }
            }
          }
        }
      }
    }
  `,
})
