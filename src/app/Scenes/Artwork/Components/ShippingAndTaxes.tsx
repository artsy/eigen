import { ActionType, ContextModule, OwnerType, TappedLearnMore } from "@artsy/cohesion"
import { Box, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { ShippingAndTaxes_artwork$data } from "__generated__/ShippingAndTaxes_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
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
        <Text variant="sm" color="mono60">
          Ships from {shippingOrigin}
        </Text>
      )}
      {!!shippingInfo && (
        <Text variant="sm" color="mono60">
          {shippingInfo}
        </Text>
      )}
      {!!pickupAvailable && (
        <Text variant="sm" color="mono60">
          Pickup available
        </Text>
      )}

      {(!!priceIncludesTaxDisplay || !!taxInfo) && <Spacer y={2} />}

      {!!priceIncludesTaxDisplay && (
        <Text variant="sm" color="mono60">
          {priceIncludesTaxDisplay}
        </Text>
      )}

      {!!taxInfo && (
        <Text variant="sm" color="mono60">
          {taxInfo.displayText}{" "}
          <RouterLink to={taxInfo.moreInfo.url} hasChildTouchable onPress={handleLearnMorePress}>
            <LinkText variant="sm">{taxInfo.moreInfo.displayText}</LinkText>
          </RouterLink>
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
