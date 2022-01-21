import { ActionType, ContextModule, OwnerType, TappedArtworkGroup } from "@artsy/cohesion"
import { FairFollowedArtistsRail_fair } from "__generated__/FairFollowedArtistsRail_fair.graphql"
import { ArtworkTileRailCardFragmentContainer as ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { navigate } from "lib/navigation/navigate"
import { compact } from "lodash"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FairFollowedArtistsRailProps {
  fair: FairFollowedArtistsRail_fair
}

export const FairFollowedArtistsRail: React.FC<FairFollowedArtistsRailProps> = ({
  fair,
  ...rest
}) => {
  if (!fair.followedArtistArtworks?.edges?.length) {
    return null
  }
  const tracking = useTracking()
  const trackTappedArtwork = (artworkID: string, artworkSlug: string, position: number) => {
    const trackTappedArtworkProps: TappedArtworkGroup = {
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
    }
    tracking.trackEvent(trackTappedArtworkProps)
  }

  const trackTappedViewAll = () => {
    const trackTappedArtworkProps: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.worksByArtistsYouFollowRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      destination_screen_owner_type: OwnerType.fairArtworks,
      type: "viewAll",
    }
    tracking.trackEvent(trackTappedArtworkProps)
  }

  const artworks = compact(fair.followedArtistArtworks.edges)

  return (
    <Box {...rest}>
      <Box flexDirection="row" justifyContent="space-between" mx={2} mb={2}>
        <Text variant="md">Works by artists you follow</Text>
        {artworks.length > 3 && (
          <TouchableOpacity
            onPress={() => {
              trackTappedViewAll()
              navigate(`/fair/${fair.slug}/followedArtists`)
            }}
          >
            <Text variant="md" color="black60">
              View all
            </Text>
          </TouchableOpacity>
        )}
      </Box>

      <FlatList<typeof artworks[number]>
        horizontal
        data={artworks}
        ListHeaderComponent={<Spacer mx={1} />}
        ListFooterComponent={<Spacer mx={1} />}
        ItemSeparatorComponent={() => <Spacer mx={0.5} />}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(item.artwork!.id || index)}
        renderItem={({ item: { artwork }, index }) => (
          <ArtworkTileRailCard
            artwork={artwork!}
            onPress={() => {
              if (!artwork!.slug) {
                return
              }
              trackTappedArtwork(artwork?.internalID ?? "", artwork?.slug ?? "", index)
              return navigate(`/artwork/${artwork!.slug}`)
            }}
          />
        )}
      />
    </Box>
  )
}

export const FairFollowedArtistsRailFragmentContainer = createFragmentContainer(
  FairFollowedArtistsRail,
  {
    fair: graphql`
      fragment FairFollowedArtistsRail_fair on Fair {
        internalID
        slug
        followedArtistArtworks: filterArtworksConnection(
          first: 20
          input: { includeArtworksByFollowedArtists: true }
        ) {
          edges {
            artwork: node {
              id
              internalID
              slug
              ...ArtworkTileRailCard_artwork
            }
          }
        }
      }
    `,
  }
)
