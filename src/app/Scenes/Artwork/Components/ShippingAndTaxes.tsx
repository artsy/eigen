import { ActionType, ContextModule, OwnerType, TappedLearnMore } from "@artsy/cohesion"
import { Spacer, Box, Text, LinkText } from "@artsy/palette-mobile"
import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ShippingAndTaxesProps {
  artwork: ShippingAndTaxes_artwork$data
}

const ShippingAndTaxes: React.FC<ShippingAndTaxesProps> = ({ artwork }) => {
  const { shippingInfo, shippingOrigin, pickupAvailable, priceIncludesTaxDisplay, taxInfo } =
    artwork
  const { trackEvent } = useTracking()

  const handleLearnMorePress = () => {
    if (!!taxInfo?.moreInfo?.url) {
      const payload: TappedLearnMore = {
        action: ActionType.tappedLearnMore,
        context_module: ContextModule.artworkDetails,
        context_screen_owner_type: OwnerType.artwork,
        subject: "Learn more",
        flow: "Shipping",
      }

      trackEvent(payload)
      navigate(taxInfo.moreInfo.url)
    }
  }

  return (
    <Box>
      {!artwork.isUnlisted && (
        <>
          <Text variant="md">Shipping and taxes</Text>
          <Spacer y={2} />
        </>
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
      {!!pickupAvailable && (
        <Text variant="sm" color="black60">
          Pickup available
        </Text>
      )}

      {(!!priceIncludesTaxDisplay || !!taxInfo) && <Spacer y={2} />}

      {!!priceIncludesTaxDisplay && (
        <Text variant="sm" color="black60">
          {priceIncludesTaxDisplay}
        </Text>
      )}

      {!!taxInfo && (
        <Text variant="sm" color="black60">
          {taxInfo.displayText}{" "}
          <LinkText variant="sm" onPress={handleLearnMorePress}>
            {taxInfo.moreInfo.displayText}
          </LinkText>
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
      pickupAvailable
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
