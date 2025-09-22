import { ActionType, ContextModule, OwnerType, TappedViewingRoomCard } from "@artsy/cohesion"
import { Box, BoxProps } from "@artsy/palette-mobile"
import { ShowViewingRoom_show$data } from "__generated__/ShowViewingRoom_show.graphql"
import { MEDIUM_CARD_ASPECT_RATIO, MediumCard } from "app/Components/Cards"
import { tagForStatus } from "app/Scenes/ViewingRoom/Components/ViewingRoomsListItem"
import { RouterLink } from "app/system/navigation/RouterLink"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ShowViewingRoomProps extends BoxProps {
  show: ShowViewingRoom_show$data
}

export const ShowViewingRoom: React.FC<ShowViewingRoomProps> = ({ show, ...rest }) => {
  const tracking = useTracking()

  const viewingRoom = show.viewingRoomsConnection?.edges?.[0]?.node

  if (!viewingRoom) {
    return null
  }

  const handlePress = () => {
    if (viewingRoom.href) {
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
  }

  return (
    <Box {...rest}>
      <RouterLink to={viewingRoom.href} onPress={handlePress}>
        <MediumCard
          width="100%"
          height="auto"
          title={viewingRoom.title}
          subtitle={show.partner?.name ?? undefined}
          image={viewingRoom.image?.imageURLs?.normalized ?? ""}
          tag={tagForStatus(
            viewingRoom.status,
            viewingRoom.distanceToOpen,
            viewingRoom.distanceToClose
          )}
          style={{ aspectRatio: MEDIUM_CARD_ASPECT_RATIO }}
          fullWidthCard
        />
      </RouterLink>
    </Box>
  )
}

export const ShowViewingRoomFragmentContainer = createFragmentContainer(ShowViewingRoom, {
  show: graphql`
    fragment ShowViewingRoom_show on Show {
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
