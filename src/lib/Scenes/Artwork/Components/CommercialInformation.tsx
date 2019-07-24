import { Box, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkAvailabilityFragmentContainer as ArtworkAvailability } from "./ArtworkAvailability"
import { ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { SellerInfoFragmentContainer as SellerInfo } from "./SellerInfo"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
}

export class CommercialInformation extends React.Component<CommercialInformationProps> {
  render() {
    const { artwork } = this.props
    const consignableArtistsCount = artwork.artists.filter(artist => artist.is_consignable).length
    const inClosedAuction = artwork.sale && artwork.sale.is_auction && artwork.sale.is_closed
    const showsSellerInfo = artwork.partner && artwork.partner.name && !inClosedAuction

    return (
      <Box>
        {artwork.availability && <ArtworkAvailability artwork={artwork} />}
        {artwork.availability && showsSellerInfo && <Spacer mb={1} />}
        {showsSellerInfo && <SellerInfo artwork={artwork} />}
        {!!consignableArtistsCount && <Spacer mb={2} />}
        <ArtworkExtraLinks consignableArtistsCount={consignableArtistsCount} />
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
      sale {
        is_auction
        is_closed
      }
      ...ArtworkAvailability_artwork
      ...SellerInfo_artwork
    }
  `,
})
