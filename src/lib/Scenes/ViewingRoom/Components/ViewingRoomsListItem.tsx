import { color, Sans } from "@artsy/palette"
import { ViewingRoomsListItem_item } from "__generated__/ViewingRoomsListItem_item.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { TouchableHighlight, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ViewingRoomSmallCard } from "./ViewingRoomSmallCard"

export interface ViewingRoomsListItemProps {
  item: ViewingRoomsListItem_item
}

export const ViewingRoomsListItem: React.FC<ViewingRoomsListItemProps> = props => {
  const { slug, title, internalID } = props.item
  const navRef = useRef(null)
  const tracking = useTracking()
  return (
    <View key={item.internalID} style={{ backgroundColor: "yellow" }}>
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
        <Sans size="3t">{title}</Sans>
        <ViewingRoomSmallCard item={item} />
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

export const ViewingRoomsListItemFragmentContainer = createFragmentContainer(ViewingRoomsListItem, {
  item: graphql`
    fragment ViewingRoomsListItem_item on ViewingRoom {
      internalID
      title
      artworksConnection(first: 3) {
        edges {
          node {
            imageUrl
          }
        }
      }
    }
  `,
})
