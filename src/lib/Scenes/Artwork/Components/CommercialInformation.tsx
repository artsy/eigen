import { Box, Spacer } from "@artsy/palette"
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
    const consignableArtistsCount = artwork.artists.filter(artist => artist.is_consignable).length

    return (
      <Box>
        {artwork.availability && <ArtworkAvailability artwork={artwork} />}
        {artwork.availability && artwork.partner && artwork.partner.name && <Spacer mb={2} />}
        {artwork.partner && artwork.partner.name && <SellerInfo artwork={artwork} />}
        {!!consignableArtistsCount && <Spacer mb={2} />}
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
      artists {
        is_consignable
      }
      ...ArtworkAvailability_artwork
      ...SellerInfo_artwork
      ...ArtworkExtraLinks_artwork
    }
  `,
})
