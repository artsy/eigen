import { Show2ViewingRoom_show } from "__generated__/Show2ViewingRoom_show.graphql"
import { navigate } from "lib/navigation/navigate"
import { tagForStatus } from "lib/Scenes/ViewingRoom/Components/ViewingRoomsListItem"
import { Box, BoxProps, MediumCard } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2ViewingRoomProps extends BoxProps {
  show: Show2ViewingRoom_show
}

export const Show2ViewingRoom: React.FC<Show2ViewingRoomProps> = ({ show, ...rest }) => {
  const viewingRoom = show.viewingRoomsConnection?.edges?.[0]?.node

  if (!viewingRoom) {
    return null
  }

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={() => navigate(viewingRoom.href!)}>
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
