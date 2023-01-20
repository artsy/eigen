import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Box, LinkText, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingAndTaxesProps {
  artwork: ShippingAndTaxes_artwork$data
}

const ShippingAndTaxes: React.FC<ShippingAndTaxesProps> = ({ artwork }) => {
  const { shippingInfo, shippingOrigin, priceIncludesTaxDisplay, taxInfo } = artwork

  const handleLearnMorePress = () => {
    navigate(taxInfo!.moreInfo.url)
  }

  return (
    <Box>
      <Text variant="md">Shipping and taxes</Text>
      <Spacer my={1} />

      {!!taxInfo && (
        <Text variant="sm" color="black60">
          {taxInfo.displayText}{" "}
          <LinkText onPress={handleLearnMorePress}>{taxInfo.moreInfo.displayText}</LinkText>
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
      taxInfo {
        displayText
        moreInfo {
          displayText
          url
        }
      }
    }
  `,
})
