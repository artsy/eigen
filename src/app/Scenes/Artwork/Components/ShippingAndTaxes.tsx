import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Box, LinkText, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingAndTaxesProps {
  artwork: ShippingAndTaxes_artwork$data
}

const ShippingAndTaxes: React.FC<ShippingAndTaxesProps> = ({ artwork }) => {
  const { shippingInfo, shippingOrigin, priceIncludesTaxDisplay } = artwork
  const avalaraPhase2 = useFeatureFlag("AREnableAvalaraPhase2")
  const shouldRenderPriceTaxLabel = !!priceIncludesTaxDisplay && !avalaraPhase2

  const handleLearnMorePress = () => {
    navigate(
      "https://support.artsy.net/hc/en-us/articles/360047294733-How-is-sales-tax-and-VAT-handled-on-works-listed-with-secure-checkout-"
    )
  }

  return (
    <Box>
      <Text variant="md">Shipping and taxes</Text>
      <Spacer my={1} />

      {!!avalaraPhase2 && (
        <Text variant="sm" color="black60">
          Taxes may apply at checkout.{" "}
          <LinkText onPress={handleLearnMorePress}>Learn more.</LinkText>
        </Text>
      )}

      {!!shippingOrigin && (
        <Text variant="sm" color="black60">
          Ships from {shippingOrigin}
        </Text>
      )}

      {!!shippingInfo && (
        <Text variant="sm" color="black60">
          {shippingInfo}
        </Text>
      )}

      {!!shouldRenderPriceTaxLabel && (
        <Text variant="sm" color="black60">
          {priceIncludesTaxDisplay}
        </Text>
      )}
    </Box>
  )
}

export const ShippingAndTaxesFragmentContainer = createFragmentContainer(ShippingAndTaxes, {
  artwork: graphql`
    fragment ShippingAndTaxes_artwork on Artwork {
      shippingOrigin
      shippingInfo
      priceIncludesTaxDisplay
    }
  `,
})
