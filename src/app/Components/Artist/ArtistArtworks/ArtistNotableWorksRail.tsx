import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistNotableWorksRail_artist } from "__generated__/ArtistNotableWorksRail_artist.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Box } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ArtistNotableWorksRailProps {
  artist: ArtistNotableWorksRail_artist
}

const ArtistNotableWorksRail: React.FC<ArtistNotableWorksRailProps> = ({ artist }) => {
  const artworks = extractNodes(artist?.filterArtworksConnection)

  if (!artist || artworks.length <= 2) {
    return null
  }

  const { trackEvent } = useTracking()

  return (
    <Box>
      <Box mt={1}>
        <SectionTitle title="Notable Works" />
      </Box>
      <ArtistNotableWorksRailWrapper>
        <SmallArtworkRail
          artworks={artworks}
          onPress={(artwork, position) => {
            if (!artwork.slug || !artwork.internalID) {
              return
            }

            trackEvent(
              tracks.tapArtwork(
                artist.internalID,
                artist.slug,
                artwork.internalID,
                artwork.slug,
                position
              )
            )

            return navigate(`/artwork/${artwork.slug}`)
          }}
          hideArtistName
        />
      </ArtistNotableWorksRailWrapper>
    </Box>
  )
}

const ArtistNotableWorksRailWrapper = styled(Box)`
  margin: 0px -20px 20px -20px;
`

export const ArtistNotableWorksRailFragmentContainer = createFragmentContainer(
  ArtistNotableWorksRail,
  {
    artist: graphql`
      fragment ArtistNotableWorksRail_artist on Artist {
        internalID
        slug
        # this should match the notableWorks query in ArtistAbout
        filterArtworksConnection(first: 10, input: { sort: "-weighted_iconicity" }) {
          edges {
            node {
              ...SmallArtworkRail_artworks
            }
          }
        }
      }
    `,
  }
)

export const tracks = {
  tapArtwork: (
    artistId: string,
    artistSlug: string,
    artworkId: string,
    artworkSlug: string,
    position: number
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.topWorksRail,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: artworkId,
    destination_screen_owner_slug: artworkSlug,
    horizontal_slide_position: position,
    module_height: "double",
    type: "thumbnail",
  }),
}
