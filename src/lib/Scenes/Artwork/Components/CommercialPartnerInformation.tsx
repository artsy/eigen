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
    const inClosedAuction = artwork.sale && artwork.sale.isAuction && artwork.sale.isClosed
    const showsSellerInfo = artwork.partner && artwork.partner.name && !inClosedAuction
    const availabilityDisplayText =
      artwork.availability &&
      (artwork.availability === "for sale" || artwork.availability === "sold" ? "Sold by" : "At")

    return (
      <>
        {showsSellerInfo && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black60">
              {availabilityDisplayText} {artwork.partner.name}
            </Sans>
            {artwork.shippingOrigin && (
              <Sans size="3t" color="black60">
                Ships from {artwork.shippingOrigin}
              </Sans>
            )}
            {artwork.shippingInfo && (
              <Sans size="3t" color="black60">
                {artwork.shippingInfo}
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
      partner {
        name
      }
      sale {
        isAuction
        isClosed
      }
    }
  `,
})
