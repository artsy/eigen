import { Box, Sans, Spacer } from "@artsy/palette"
import { ArtworkInformation_artwork } from "__generated__/ArtworkInformation_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkAvailabilityFragmentContainer as ArtworkAvailability } from "./ArtworkAvailability"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { SellerInfoFragmentContainer as SellerInfo } from "./SellerInfo"

interface ArtworkInformationProps {
  artwork: ArtworkInformation_artwork
}

export class ArtworkInformation extends React.Component<ArtworkInformationProps> {
  render() {
    const { artwork } = this.props
    console.log("ARTWORK", artwork)
    return (
      <Box>
        {artwork.availability && (
          <Box mb={1}>
            <ArtworkAvailability artwork={artwork} />
          </Box>
        )}
        {artwork.partner && artwork.partner.name && <SellerInfo artwork={artwork} />}
        <ArtworkExtraLinks artwork={artwork} />
      </Box>
    )
  }
}

export const ArtworkInformationFragmentContainer = createFragmentContainer(ArtworkInformation, {
  artwork: graphql`
    fragment ArtworkInformation_artwork on Artwork {
      availability
      partner {
        name
      }
      ...ArtworkAvailability_artwork
      ...SellerInfo_artwork
      ...ArtworkExtraLinks_artwork
    }
  `,
})
