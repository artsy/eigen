import { ViewingRoomsListItem_item$key } from "__generated__/ViewingRoomsListItem_item.graphql"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { CardTagProps, SmallCard, Touchable } from "palette"
import React from "react"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const tagForStatus = (
  status: string,
  distanceToOpen: string | null,
  distanceToClose: string | null
): CardTagProps | undefined => {
  switch (status) {
    case "closed":
      return { text: "Closed", textColor: "white100", color: "black100" }
    case "live":
      if (distanceToClose === null) {
        return undefined
      }
      return {
        text: `${distanceToClose} left`,
        textColor: "black60",
        color: "white100",
        borderColor: "black5",
      }
    case "scheduled":
      if (distanceToOpen === null) {
        return undefined
      }
      return { text: "Opening soon", textColor: "white100", color: "black100" }
  }
  return undefined
}

const fragmentSpec = graphql`
  fragment ViewingRoomsListItem_item on ViewingRoom {
    internalID
    title
    slug
    heroImage: image {
      imageURLs {
        normalized
      }
    }
    status
    distanceToOpen(short: true)
    distanceToClose(short: true)
    partner {
      name
    }
    artworksConnection(first: 2) {
      edges {
        node {
          image {
            square: url(version: "square")
            regular: url(version: "larger")
          }
        }
      }
    }
  }
`

export interface ViewingRoomsListItemProps {
  item: ViewingRoomsListItem_item$key
}

export const ViewingRoomsListItem: React.FC<ViewingRoomsListItemProps> = (props) => {
  const item = useFragment(fragmentSpec, props.item)
  const { slug, internalID, heroImage, title, status, distanceToClose, distanceToOpen } = item
  const { trackEvent } = useTracking()

  const tag = tagForStatus(status, distanceToOpen, distanceToClose)

  const extractedArtworks = extractNodes(item.artworksConnection)
  let artworks: string[] = []
  if (extractedArtworks.length === 1) {
    artworks = extractedArtworks.map((a) => a.image!.regular!)
  } else if (extractedArtworks.length > 1) {
    artworks = extractedArtworks.map((a) => a.image!.square!)
  }
  const images = [heroImage?.imageURLs?.normalized ?? "", ...artworks]

  return (
    <View>
      <Touchable
        onPress={() => {
          trackEvent(tracks.tapViewingRoomListItem(internalID, slug))
          navigate(`/viewing-room/${slug!}`)
        }}
      >
        <SmallCard
          images={images}
          title={title}
          subtitle={item.partner?.name ?? undefined}
          tag={tag}
        />
      </Touchable>
    </View>
  )
}

export const tracks = {
  tapViewingRoomListItem: (vrId: string, vrSlug: string) => ({
    action: Schema.ActionNames.TappedViewingRoomGroup,
    context_module: Schema.ContextModules.LatestViewingRoomsRail,
    context_screen: Schema.PageNames.ViewingRoomsList,
    context_screen_owner_type: Schema.OwnerEntityTypes.Home,
    destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    destination_screen_owner_id: vrId,
    destination_screen_owner_slug: vrSlug,
  }),
}
