import { Box } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkAvailabilityFragmentContainer as ArtworkAvailability } from "./ArtworkAvailability"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { SellerInfoFragmentContainer as SellerInfo } from "./SellerInfo"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
}

export class CommercialInformation extends React.Component<CommercialInformationProps> {
  render() {
    const { artwork } = this.props
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

export const CommercialInformationFragmentContainer = createFragmentContainer(CommercialInformation, {
  artwork: graphql`
    fragment CommercialInformation_artwork on Artwork {
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
