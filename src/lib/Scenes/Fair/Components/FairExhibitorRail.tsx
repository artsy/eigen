import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { FairExhibitorRail_show } from "__generated__/FairExhibitorRail_show.graphql"
import { SmallArtworkRail } from "lib/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FairExhibitorRailProps {
  show: FairExhibitorRail_show
}

const FairExhibitorRail: React.FC<FairExhibitorRailProps> = ({ show }) => {
  const { trackEvent } = useTracking()

  const artworks = extractNodes(show?.artworksConnection)

  const count = show?.counts?.artworks ?? 0
  const partnerName = show?.partner?.name ?? ""
  const viewAllUrl = show?.href

  const trackTappedArtwork = (artworkID: string, artworkSlug: string, position: number) => {
    trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.galleryBoothRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: show.fair?.internalID ?? "",
      context_screen_owner_slug: show.fair?.slug ?? "",
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_id: artworkID,
      destination_screen_owner_slug: artworkSlug,
      horizontal_slide_position: position,
      type: "thumbnail",
    })
  }

  const trackTappedShow = (showInternalID: string, showSlug: string) => {
    trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.galleryBoothRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: show.fair?.internalID ?? "",
      context_screen_owner_slug: show.fair?.slug ?? "",
      destination_screen_owner_type: OwnerType.show,
      destination_screen_owner_id: showInternalID,
      destination_screen_owner_slug: showSlug,
      type: "viewAll",
    })
  }

  if (count === 0) {
    return null
  }

  return (
    <>
      <Flex px={2}>
        <SectionTitle
          title={partnerName}
          subtitle={`${count} works`}
          onPress={() => {
            if (!viewAllUrl) {
              return
            }
            trackTappedShow(show.internalID, show.slug)
            navigate(viewAllUrl)
          }}
        />
      </Flex>
      <SmallArtworkRail
        artworks={artworks}
        onPress={(artwork, position) => {
          trackTappedArtwork(artwork?.internalID ?? "", artwork?.slug ?? "", position)
          navigate(artwork?.href!)
        }}
      />
    </>
  )
}

export const FairExhibitorRailFragmentContainer = createFragmentContainer(FairExhibitorRail, {
  show: graphql`
    fragment FairExhibitorRail_show on Show {
      internalID
      slug
      href
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      counts {
        artworks
      }
      fair {
        internalID
        slug
      }
      artworksConnection(first: 20) {
        edges {
          node {
            ...SmallArtworkRail_artworks
          }
        }
      }
    }
  `,
})
