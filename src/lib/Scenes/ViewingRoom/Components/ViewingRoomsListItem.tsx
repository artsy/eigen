import { CardTagProps, color, SmallCard } from "@artsy/palette"
import { ViewingRoomsListItem_item$key } from "__generated__/ViewingRoomsListItem_item.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { TouchableHighlight, View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment } from "relay-hooks"

const tagForStatus = (
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
        textColor: "purple100",
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
    heroImageURL
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

export const ViewingRoomsListItem: React.FC<ViewingRoomsListItemProps> = props => {
  const item = useFragment<ViewingRoomsListItem_item$key>(fragmentSpec, props.item)
  const { slug, internalID, heroImageURL, title, status, distanceToClose, distanceToOpen } = item
  const navRef = useRef(null)
  const tracking = useTracking()

  const tag = tagForStatus(status, distanceToOpen, distanceToClose)

  const extractedArtworks = extractNodes(item.artworksConnection)
  let artworks: string[] = []
  if (extractedArtworks.length === 1) {
    artworks = extractedArtworks.map(a => a.image!.regular!)
  } else if (extractedArtworks.length > 1) {
    artworks = extractedArtworks.map(a => a.image!.square!)
  }
  const images = [heroImageURL!, ...artworks]

  return (
    <View>
      <TouchableHighlight
        ref={navRef}
        onPress={() => {
          tracking.trackEvent({
            ...tracks.context(internalID, slug),
          })
          SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${slug!}`)
        }}
        underlayColor={color("white100")}
        activeOpacity={0.8}
      >
        <SmallCard images={images} title={title} subtitle={item.partner?.name ?? undefined} tag={tag} />
      </TouchableHighlight>
    </View>
  )
}

// TODO: Get Louis' help defining how tracking should look here
export const tracks = {
  context: (viewingRoomID: string, viewingRoomSlug: string) => {
    return {
      context_screen: Schema.PageNames.ViewingRoomsList,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: viewingRoomID,
      context_screen_owner_slug: viewingRoomSlug,
    }
  },
  tappedViewingRoom: (artworkID: string, artworkSlug: string) => {
    return {
      // action_name: Schema.ActionNames.tappedViewingRoom,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkGrid,
      destination_screen: Schema.PageNames.ArtworkPage,
      destination_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
      destination_screen_owner_id: artworkID,
      destination_screen_owner_slug: artworkSlug,
    }
  },
}
