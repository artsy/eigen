import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Box, LinkText, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingAndTaxesProps {
  artwork: ShippingAndTaxes_artwork$data
}

const ShippingAndTaxes: React.FC<ShippingAndTaxesProps> = ({ artwork }) => {
  const { shippingInfo, shippingOrigin, priceIncludesTaxDisplay } = artwork

  const handleLearnMorePress = () => {
    navigate(
      "https://support.artsy.net/hc/en-us/articles/360047294733-How-is-sales-tax-and-VAT-handled-on-works-listed-with-secure-checkout-"
    )
  }

  return (
    <Box>
      <Text variant="md">Shipping and taxes</Text>
      <Spacer my={1} />

      <Text variant="sm" color="black60">
        Taxes may apply at checkout. <LinkText onPress={handleLearnMorePress}>Learn more.</LinkText>
      </Text>

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

      {!!priceIncludesTaxDisplay && (
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
