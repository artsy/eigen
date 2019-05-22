import { Box, Sans } from "@artsy/palette"
import { ArtworkAvailability_artwork } from "__generated__/ArtworkAvailability_artwork.graphql"
import { capitalize } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkAvailabilityProps {
  artwork: ArtworkAvailability_artwork
}

export class ArtworkAvailability extends React.Component<ArtworkAvailabilityProps> {
  render() {
    return (
      <Box>
        <Sans size="4" weight="medium">
          {capitalize(this.props.artwork.availability)}
        </Sans>
      </Box>
    )
  }
}

export const ArtworkAvailabilityFragmentContainer = createFragmentContainer(ArtworkAvailability, {
  artwork: graphql`
    fragment ArtworkAvailability_artwork on Artwork {
      availability
    }
  `,
})
