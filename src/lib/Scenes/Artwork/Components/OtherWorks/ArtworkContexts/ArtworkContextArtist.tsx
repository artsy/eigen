import { Join, Spacer } from "@artsy/palette"
import { ArtworkContextArtist_artwork } from "__generated__/ArtworkContextArtist_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtistArtworkGrid, PartnerArtworkGrid } from "./ArtworkGrids"

export const ArtworkContextArtistFragmentContainer = createFragmentContainer<{
  artwork: ArtworkContextArtist_artwork
}>(
  props => {
    return (
      <Join separator={<Spacer my={2} />}>
        <ArtistArtworkGrid artwork={props.artwork} />
        <PartnerArtworkGrid artwork={props.artwork} />
      </Join>
    )
  },
  {
    artwork: graphql`
      fragment ArtworkContextArtist_artwork on Artwork {
        ...ArtistArtworkGrid_artwork
        ...PartnerArtworkGrid_artwork
      }
    `,
  }
)
