import { CommercialPartnerInformation_artwork } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { LinkText, Sans, Spacer } from "palette"
import React from "react"
import { useIntl } from "react-intl"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: CommercialPartnerInformation_artwork
}

export const CommercialPartnerInformation: React.FC<Props> = ({ artwork }) => {
  const artworkIsSold = artwork.availability && artwork.availability === "sold"
  const artworkEcommerceAvailable = artwork.isAcquireable || artwork.isOfferable
  const showsSellerInfo = artwork.partner && artwork.partner.name
  const availabilityDisplayText = artwork.isForSale || artworkIsSold ? "From" : "At"
  const avalaraPhase2 = useFeatureFlag("AREnableAvalaraPhase2")

  const intl = useIntl()

  return (
    <>
      {showsSellerInfo && (
        <>
          <Spacer mb={1} />
          <Sans size="3t" color="black60">
            {availabilityDisplayText} {artwork.partner!.name}
          </Sans>
          {avalaraPhase2 && (
            <Sans size="3t" color="black60">
              {intl.formatMessage({
                id: "scene.artwork.components.CommercialPartnerInformation.taxes",
                defaultMessage: "Taxes may apply at checkout. ",
              })}
              <LinkText
                onPress={() => {
                  navigate(
                    "https://support.artsy.net/hc/en-us/articles/360047294733-How-is-sales-tax-and-VAT-handled-on-works-listed-with-secure-checkout-"
                  )
                }}
              >
                {intl.formatMessage({
                  id: "scene.artwork.components.CommercialPartnerInformation.learnMore",
                  defaultMessage: "Learn more.",
                })}
              </LinkText>
            </Sans>
          )}
          {artworkEcommerceAvailable && !!artwork.shippingOrigin && (
            <Sans size="3t" color="black60">
              {intl.formatMessage(
                { id: "scene.artwork.components.CommercialPartnerInformation.shipsFrom" },
                { shippingOrigin: artwork.shippingOrigin }
              )}
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
        </>
      )}
    </>
  )
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
