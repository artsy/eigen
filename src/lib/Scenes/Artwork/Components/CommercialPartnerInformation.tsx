import { CommercialPartnerInformation_artwork } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import { LinkText } from "lib/Components/Text/LinkText"
import { navigate } from "lib/navigation/navigate"
import { unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: CommercialPartnerInformation_artwork
}

export class CommercialPartnerInformation extends React.Component<Props> {
  render() {
    const { artwork } = this.props
    const artworkIsSold = artwork.availability && artwork.availability === "sold"
    const artworkEcommerceAvailable = artwork.isAcquireable || artwork.isOfferable
    const showsSellerInfo = artwork.partner && artwork.partner.name
    const availabilityDisplayText = artwork.isForSale || artworkIsSold ? "From" : "At"
    const avalaraPhase2 = unsafe_getFeatureFlag("AREnableAvalaraPhase2")
    return (
      <>
        {showsSellerInfo && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black60">
              {availabilityDisplayText} {artwork.partner! /* STRICTNESS_MIGRATION */.name}
            </Sans>
            {artworkEcommerceAvailable && !!artwork.shippingOrigin && (
              <Sans size="3t" color="black60">
                Ships from {artwork.shippingOrigin}
              </Sans>
            )}
            {artworkEcommerceAvailable && !!artwork.shippingInfo && (
              <Sans size="3t" color="black60">
                {artwork.shippingInfo}
              </Sans>
            )}
            {artworkEcommerceAvailable && !!artwork.priceIncludesTaxDisplay && !avalaraPhase2 && (
              <Sans size="3t" color="black60">
                {artwork.priceIncludesTaxDisplay}
              </Sans>
            )}
            {avalaraPhase2 && (
              <Sans size="3t" color="black60">
                Taxes may apply at checkout.{" "}
                <LinkText
                  onPress={() => {
                    navigate(
                      "https://support.artsy.net/hc/en-us/articles/360047294733-How-is-sales-tax-and-VAT-handled-on-works-listed-with-secure-checkout-"
                    )
                  }}
                >
                  Learn more.
                </LinkText>
              </Sans>
            )}
          </>
        )}
      </>
    )
  }
}

export const CommercialPartnerInformationFragmentContainer = createFragmentContainer(
  CommercialPartnerInformation,
  {
    artwork: graphql`
      fragment CommercialPartnerInformation_artwork on Artwork {
        availability
        isAcquireable
        isForSale
        isOfferable
        shippingOrigin
        shippingInfo
        priceIncludesTaxDisplay
        partner {
          name
        }
      }
    `,
  }
)
