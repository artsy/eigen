import { Sans, Spacer } from "@artsy/palette"
import { CommercialPartnerInformation_artwork } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: CommercialPartnerInformation_artwork
}

export class CommercialPartnerInformation extends React.Component<Props> {
  render() {
    const { artwork } = this.props
    const artworkIsForSale = (artwork.availability && artwork.availability === "for sale") || artwork.isBiddable
    const artworkIsSold = artwork.availability && artwork.availability === "sold"
    const showsSellerInfo = artwork.partner && artwork.partner.name
    const availabilityDisplayText = artworkIsForSale || artworkIsSold ? "Sold by" : "At"
    return (
      <>
        {showsSellerInfo && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black60">
              {availabilityDisplayText} {artwork.partner.name}
            </Sans>
            {artworkIsForSale &&
              artwork.shippingOrigin && (
                <Sans size="3t" color="black60">
                  Ships from {artwork.shippingOrigin}
                </Sans>
              )}
            {artworkIsForSale &&
              artwork.shippingInfo && (
                <Sans size="3t" color="black60">
                  {artwork.shippingInfo}
                </Sans>
              )}
            {artworkIsForSale &&
              artwork.priceIncludesTax && (
                <Sans size="3t" color="black60">
                  VAT included in price
                </Sans>
              )}
          </>
        )}
      </>
    )
  }
}

export const CommercialPartnerInformationFragmentContainer = createFragmentContainer(CommercialPartnerInformation, {
  artwork: graphql`
    fragment CommercialPartnerInformation_artwork on Artwork {
      availability
      shippingOrigin
      shippingInfo
      priceIncludesTax
      partner {
        name
      }
      isBiddable
    }
  `,
})
