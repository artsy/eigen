import { Flex } from "@artsy/palette"
import { ViewingRoomArtworkRail_viewingRoom } from "__generated__/ViewingRoomArtworkRail_viewingRoom.graphql"
import { ArtworkTileRail } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ViewingRoomArtworkRailProps {
  viewingRoom: ViewingRoomArtworkRail_viewingRoom
}

export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = props => {
  const viewingRoom = props.viewingRoom
  const totalCount = viewingRoom.artworks! /* STRICTNESS_MIGRATION */.totalCount! /* STRICTNESS_MIGRATION */
  const tracking = useTracking()
  const navRef = useRef()
  const pluralizedArtworksCount = totalCount === 1 ? "artwork" : "artworks"

  return (
    <View ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <Flex>
        <SectionTitle
          title={`${totalCount} ${pluralizedArtworksCount}`}
          onPress={() => {
            tracking.trackEvent(tracks.tappedArtworkGroupHeader(viewingRoom.internalID, viewingRoom.slug))
            SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${viewingRoom.slug}/artworks`)
          }}
        />
        <ArtworkTileRail
          artworksConnection={props!.viewingRoom!.artworks!}
          contextModule={Schema.ContextModules.ViewingRoomArtworkRail}
        />
      </Flex>
    </View>
  )
}

export const tracks = {
  tappedArtworkGroupHeader: (internalID: string, slug: string) => {
    return {
      action_name: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      destination_screen_owner_id: internalID,
      destination_screen_owner_slug: slug,
      type: "header",
    }
  },
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoom: graphql`
    fragment ViewingRoomArtworkRail_viewingRoom on ViewingRoom {
      slug
      internalID
      artworks: artworksConnection(first: 5) {
        totalCount
        ...ArtworkTileRail_artworksConnection
      }
    }
  `,
})
