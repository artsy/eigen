import { ViewingRoomArtworkRail_viewingRoom } from "__generated__/ViewingRoomArtworkRail_viewingRoom.graphql"
import { SmallArtworkRail } from "lib/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ViewingRoomArtworkRailProps {
  viewingRoom: ViewingRoomArtworkRail_viewingRoom
}

export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = (props) => {
  const viewingRoom = props.viewingRoom
  const totalCount = viewingRoom.artworks?.totalCount
  const tracking = useTracking()
  const pluralizedArtworksCount = totalCount === 1 ? "artwork" : "artworks"

  const artworks = extractNodes(props.viewingRoom?.artworks)

  return (
    <Flex>
      <Flex mx="2">
        <SectionTitle
          title={`${totalCount} ${pluralizedArtworksCount}`}
          onPress={() => {
            tracking.trackEvent(tracks.tappedArtworkGroupHeader(viewingRoom.internalID, viewingRoom.slug))
            navigate(`/viewing-room/${viewingRoom.slug}/artworks`)
          }}
        />
      </Flex>
      <SmallArtworkRail
        artworks={artworks}
        onPress={(artwork) => {
          tracking.trackEvent(
            tracks.tappedArtworkThumbnail(viewingRoom.internalID, viewingRoom.slug, artwork.internalID, artwork.slug)
          )
          navigate(`/viewing-room/${viewingRoom.slug}/${artwork.slug}`)
        }}
      />
    </Flex>
  )
}

export const tracks = {
  tappedArtworkGroupHeader: (internalID: string, slug: string) => {
    return {
      action: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      destination_screen_owner_id: internalID,
      destination_screen_owner_slug: slug,
      type: "header",
    }
  },
  tappedArtworkThumbnail: (vrId: string, vrSlug: string, artworkId: string, artworkSlug: string) => ({
    action: Schema.ActionNames.TappedArtworkGroup,
    context_module: Schema.ContextModules.ViewingRoomArtworkRail,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: vrId,
    context_screen_owner_slug: vrSlug,
    destination_screen: Schema.PageNames.ViewingRoomArtworkPage,
    destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    destination_screen_owner_id: vrId,
    destination_screen_owner_slug: vrSlug,
    artwork_id: artworkId,
    artwork_slug: artworkSlug,
    type: "thumbnail",
  }),
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoom: graphql`
    fragment ViewingRoomArtworkRail_viewingRoom on ViewingRoom {
      slug
      internalID
      artworks: artworksConnection(first: 10) {
        totalCount
        edges {
          node {
            ...SmallArtworkRail_artworks
          }
        }
      }
    }
  `,
})
