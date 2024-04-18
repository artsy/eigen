import { Spacer, Box, Text, LinkText } from "@artsy/palette-mobile"
import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"

interface ShippingAndTaxesProps {
  artwork: ShippingAndTaxes_artwork$data
}

const ShippingAndTaxes: React.FC<ShippingAndTaxesProps> = ({ artwork }) => {
  const { shippingInfo, shippingOrigin, priceIncludesTaxDisplay, taxInfo } = artwork

  const handleLearnMorePress = () => {
    if (!!taxInfo?.moreInfo?.url) {
      navigate(taxInfo.moreInfo.url)
    }
  }

  return (
    <Box>
      {!artwork.isUnlisted && (
        <>
          <Text variant="md">Shipping and taxes</Text>
          <Spacer y={1} />
        </>
      )}

      {!!taxInfo && !artwork.isUnlisted && (
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
      isUnlisted
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
