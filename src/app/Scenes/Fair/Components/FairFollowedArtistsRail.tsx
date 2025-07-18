import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { FairFollowedArtistsRail_fair$data } from "__generated__/FairFollowedArtistsRail_fair.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import {
  CollectorSignals,
  getArtworkSignalTrackingFields,
} from "app/utils/getArtworkSignalTrackingFields"
import { memo } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FairFollowedArtistsRailProps {
  fair: FairFollowedArtistsRail_fair$data
}

export const FairFollowedArtistsRail: React.FC<FairFollowedArtistsRailProps> = memo(({ fair }) => {
  const { trackEvent } = useTracking()
  const artworks = extractNodes(fair?.filterArtworksConnection)

  if (!artworks.length) {
    return null
  }

  const viewAllUrl = `/fair/${fair.slug}/followedArtists`
  return (
    <>
      <Flex>
        <SectionTitle
          mx={2}
          title="Works by artists you follow"
          href={artworks.length > 2 ? viewAllUrl : undefined}
          onPress={
            artworks.length > 2
              ? () => {
                  trackEvent(tracks.tappedViewAll(fair))
                }
              : undefined
          }
        />
      </Flex>
      <ArtworkRail
        artworks={artworks}
        onPress={(artwork, position) => {
          trackEvent(
            tracks.tappedArtwork(
              fair,
              artwork?.internalID ?? "",
              artwork?.slug ?? "",
              position,
              artwork.collectorSignals
            )
          )
        }}
        showSaveIcon
        onMorePress={() => {
          trackEvent(tracks.tappedViewAll(fair))
          navigate(viewAllUrl)
        }}
      />
    </>
  )
})

export const FairFollowedArtistsRailFragmentContainer = createFragmentContainer(
  FairFollowedArtistsRail,
  {
    fair: graphql`
      fragment FairFollowedArtistsRail_fair on Fair {
        internalID
        slug
        filterArtworksConnection(first: 10, input: { includeArtworksByFollowedArtists: true }) {
          edges {
            node {
              ...ArtworkRail_artworks
            }
          }
        }
      }
    `,
  }
)

const tracks = {
  tappedArtwork: (
    fair: FairFollowedArtistsRail_fair$data,
    artworkID: string,
    artworkSlug: string,
    position: number,
    collectorSignals: CollectorSignals
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.worksByArtistsYouFollowRail,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: artworkID,
    destination_screen_owner_slug: artworkSlug,
    horizontal_slide_position: position,
    type: "thumbnail",
    ...getArtworkSignalTrackingFields(collectorSignals),
  }),
  tappedViewAll: (fair: FairFollowedArtistsRail_fair$data) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.worksByArtistsYouFollowRail,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: fair.internalID,
    context_screen_owner_slug: fair.slug,
    destination_screen_owner_type: OwnerType.fairArtworks,
    type: "viewAll",
  }),
}
