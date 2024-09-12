import { Flex } from "@artsy/palette-mobile"
import { ViewingRoomArtworkRail_viewingRoom$data } from "__generated__/ViewingRoomArtworkRail_viewingRoom.graphql"
import { ArtworkRail2 } from "app/Components/ArtworkRail/ArtworkRail2"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ViewingRoomArtworkRailProps {
  viewingRoom: ViewingRoomArtworkRail_viewingRoom$data
}

export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = ({ viewingRoom }) => {
  const tracking = useTracking()

  const artworks = extractNodes(viewingRoom?.artworks)

  const totalCount = viewingRoom.artworks?.totalCount
  const pluralizedArtworksCount = totalCount === 1 ? "artwork" : "artworks"
  const title = `${typeof totalCount === "number" ? totalCount : ""} ${pluralizedArtworksCount}`

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle
          title={title}
          onPress={() => {
            tracking.trackEvent(
              tracks.tappedArtworkGroupHeader(viewingRoom.internalID, viewingRoom.slug)
            )
            navigate(`/viewing-room/${viewingRoom.slug}/artworks`)
          }}
        />
      </Flex>
      <ArtworkRail2
        artworks={artworks}
        onPress={(artwork) => {
          tracking.trackEvent(
            tracks.tappedArtworkThumbnail(
              viewingRoom.internalID,
              viewingRoom.slug,
              artwork.internalID,
              artwork.slug
            )
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
  tappedArtworkThumbnail: (
    vrId: string,
    vrSlug: string,
    artworkId: string,
    artworkSlug: string
  ) => ({
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
            ...ArtworkRail2_artworks
          }
        }
      }
    }
  `,
})
