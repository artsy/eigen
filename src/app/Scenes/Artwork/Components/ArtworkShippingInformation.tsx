import { ActionType, ClickedOnLearnMore } from "@artsy/cohesion"
import { Text } from "@artsy/palette"
import { RouterLink } from "System/Router/RouterLink"
import { ArtworkShippingInformation_artwork$data } from "__generated__/ArtworkShippingInformation_artwork.graphql"
import { useTranslation } from "react-i18next"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ShippingInformationProps {
  artwork: ArtworkShippingInformation_artwork$data
}

const ArtworkShippingInformation: React.FC<ShippingInformationProps> = ({
  artwork: { shippingOrigin, shippingInfo, isUnlisted },
}) => {
  const { t } = useTranslation()
  const { trackEvent } = useTracking()

  if (isUnlisted) {
    return (
      <>
        {!!shippingOrigin && (
          <Text variant="sm" color="black60">
            {t`artworkPage.sidebar.shippingAndTaxes.shipsFrom`} {shippingOrigin}
          </Text>
        )}

        <Text variant="xs" color="black60">
          Shipping and taxes may apply at checkout.{" "}
          <RouterLink
            inline
            to="https://support.artsy.net/s/article/How-are-taxes-customs-VAT-and-import-fees-handled-on-works-listed-with-secure-checkout"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              const payload: ClickedOnLearnMore = {
                action: ActionType.clickedOnLearnMore,
                context_module: "Sidebar",
                subject: "Learn more",
                type: "Link",
                flow: "Shipping",
              }

              trackEvent(payload)
            }}
          >
            {t`artworkPage.sidebar.shippingAndTaxes.taxInformationLearnMore`}
          </RouterLink>
        </Text>
      </>
    )
  }

  return (
    <>
      <Text variant="sm" color="black60">
        {t`artworkPage.sidebar.shippingAndTaxes.taxInformation`}{" "}
        <RouterLink
          inline
          to="https://support.artsy.net/s/article/How-are-taxes-customs-VAT-and-import-fees-handled-on-works-listed-with-secure-checkout"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t`artworkPage.sidebar.shippingAndTaxes.taxInformationLearnMore`}
        </RouterLink>
      </Text>

      {!!shippingOrigin && (
        <Text variant="sm" color="black60">
          {t`artworkPage.sidebar.shippingAndTaxes.shipsFrom`} {shippingOrigin}
        </Text>
      )}

      {!!shippingInfo && (
        <Text variant="sm" color="black60" data-testid="shipping-info">
          {shippingInfo}
        </Text>
      )}
    </>
  )
}

export const ArtworkShippingInformationFragmentContainer = createFragmentContainer(
  ArtworkShippingInformation,
  {
    artwork: graphql`
      fragment ArtworkShippingInformation_artwork on Artwork {
        isUnlisted
        shippingOrigin
        shippingInfo
      }
    `,
  }
)
