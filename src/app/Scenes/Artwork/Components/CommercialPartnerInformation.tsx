import { CommercialPartnerInformation_artwork$data } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { LinkText, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: CommercialPartnerInformation_artwork$data
}

export const CommercialPartnerInformation: React.FC<Props> = ({ artwork }) => {
  const artworkEcommerceAvailable = artwork.isAcquireable || artwork.isOfferable
  const showsSellerInfo = artwork.partner && artwork.partner.name
  const shouldRenderShipsFromLabel = artworkEcommerceAvailable && !!artwork.shippingOrigin
  const shouldRenderShippingInfoLabel = artworkEcommerceAvailable && !!artwork.shippingInfo
  const shouldRenderLabels = shouldRenderShipsFromLabel || shouldRenderShippingInfoLabel

  if (!showsSellerInfo || !shouldRenderLabels) {
    return null
  }

  return (
    <>
      <Spacer mb={1} />
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
    </>
  )
}

export const CommercialPartnerInformationFragmentContainer = createFragmentContainer(
  CommercialPartnerInformation,
  {
    artwork: graphql`
      fragment CommercialPartnerInformation_artwork on Artwork {
        isAcquireable
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
