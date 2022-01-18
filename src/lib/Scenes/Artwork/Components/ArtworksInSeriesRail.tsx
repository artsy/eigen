import { ActionType, ContextModule, OwnerType, ScreenOwnerType, TappedArtworkGroup } from "@artsy/cohesion"
import { ArtworksInSeriesRail_artwork } from "__generated__/ArtworksInSeriesRail_artwork.graphql"
import { SmallArtworkRail } from "lib/Components/ArtworkRail/SmallArtworkRail"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { ArrowRightIcon, Flex, Sans } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksInSeriesRailProps {
  artwork: ArtworksInSeriesRail_artwork
}

export const ArtworksInSeriesRail: React.FC<ArtworksInSeriesRailProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()

  const artistSeriesSlug = artwork?.artistSeriesConnection?.edges?.[0]?.node?.slug
  const artistSeriesID = artwork?.artistSeriesConnection?.edges?.[0]?.node?.internalID
  const filterArtworksConnection = artwork?.artistSeriesConnection?.edges?.[0]?.node?.filterArtworksConnection

  if (!filterArtworksConnection) {
    return null
  }

  const artworks = extractNodes(filterArtworksConnection)

  const trackingContext = {
    context_module: ContextModule.moreFromThisSeries,
    context_screen_owner_type: OwnerType.artwork as ScreenOwnerType,
    context_screen_owner_id: artwork.internalID,
    context_screen_owner_slug: artwork.slug,
  }

  const trackHeaderClick = ({
    destinationScreenOwnerID,
    destinationScreenOwnerSlug,
  }: {
    destinationScreenOwnerID: string
    destinationScreenOwnerSlug: string
  }) => {
    const properties: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      ...trackingContext,
      destination_screen_owner_type: OwnerType.artistSeries,
      destination_screen_owner_slug: destinationScreenOwnerSlug,
      destination_screen_owner_id: destinationScreenOwnerID,
      type: "viewAll",
    }

    trackEvent(properties)
  }

  const trackArtworkClick = ({
    destinationScreenOwnerID,
    destinationScreenOwnerSlug,
  }: {
    destinationScreenOwnerID: string
    destinationScreenOwnerSlug: string
  }) => {
    const properties: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      ...trackingContext,
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_slug: destinationScreenOwnerSlug,
      destination_screen_owner_id: destinationScreenOwnerID,
      type: "thumbnail",
    }

    trackEvent(properties)
  }

  return (
    <Flex>
      <TouchableOpacity
        onPress={() => {
          trackHeaderClick({ destinationScreenOwnerSlug: artistSeriesSlug!, destinationScreenOwnerID: artistSeriesID! })
          navigate(`/artist-series/${artistSeriesSlug}`)
        }}
      >
        <Flex pb={1} flexDirection="row" justifyContent="space-between">
          <Sans size="4">More from this series</Sans>
          <ArrowRightIcon mr="-5px" />
        </Flex>
      </TouchableOpacity>
      <SmallArtworkRail
        artworks={artworks}
        onPress={(_, id, slug, href) => {
          trackArtworkClick({ destinationScreenOwnerID: id, destinationScreenOwnerSlug: slug })
          navigate(href!)
        }}
        ListHeaderComponent={null}
        ListFooterComponent={null}
      />
    </Flex>
  )
}

export const ArtworksInSeriesRailFragmentContainer = createFragmentContainer(ArtworksInSeriesRail, {
  artwork: graphql`
    fragment ArtworksInSeriesRail_artwork on Artwork {
      internalID
      slug
      artistSeriesConnection(first: 1) {
        edges {
          node {
            slug
            internalID
            filterArtworksConnection(first: 20, input: { sort: "-decayed_merch" }) {
              edges {
                node {
                  ...SmallArtworkRail_artworks
                }
              }
            }
          }
        }
      }
    }
  `,
})
