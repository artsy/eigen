import { CommercialPartnerInformation_artwork } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { LinkText, Sans, Spacer, Text } from "palette"
import React from "react"
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
  const enableCreateArtworkAlert = useFeatureFlag("AREnableCreateArtworkAlert")
  const shouldRenderShipsFromLabel = artworkEcommerceAvailable && !!artwork.shippingOrigin
  const shouldRenderShippingInfoLabel = artworkEcommerceAvailable && !!artwork.shippingInfo
  const shouldRenderPriceTaxLabel =
    artworkEcommerceAvailable && !!artwork.priceIncludesTaxDisplay && !avalaraPhase2

  if (!showsSellerInfo) {
    return null
  }

  if (enableCreateArtworkAlert) {
    const shouldRenderLabels =
      avalaraPhase2 ||
      shouldRenderShipsFromLabel ||
      shouldRenderShippingInfoLabel ||
      shouldRenderPriceTaxLabel

    if (!shouldRenderLabels) {
      return null
    }

    return (
      <>
        <Spacer mb={1} />
        {avalaraPhase2 && (
          <Text variant="xs" color="black60">
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
          </Text>
        )}
        {shouldRenderShipsFromLabel && (
          <Text variant="xs" color="black60">
            Ships from {artwork.shippingOrigin}
          </Text>
        )}
        {shouldRenderShippingInfoLabel && (
          <Text variant="xs" color="black60">
            {artwork.shippingInfo}
          </Text>
        )}
        {shouldRenderPriceTaxLabel && (
          <Text variant="xs" color="black60">
            {artwork.priceIncludesTaxDisplay}
          </Text>
        )}
      </>
    )
  }

  return (
    <>
      <Spacer mb={1} />
      <Sans size="3t" color="black60">
        {availabilityDisplayText} {artwork.partner!.name}
      </Sans>
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
      {shouldRenderShipsFromLabel && (
        <Sans size="3t" color="black60">
          Ships from {artwork.shippingOrigin}
        </Sans>
      )}
      {shouldRenderShippingInfoLabel && (
        <Sans size="3t" color="black60">
          {artwork.shippingInfo}
        </Sans>
      )}
      {shouldRenderPriceTaxLabel && (
        <Sans size="3t" color="black60">
          {artwork.priceIncludesTaxDisplay}
        </Sans>
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
