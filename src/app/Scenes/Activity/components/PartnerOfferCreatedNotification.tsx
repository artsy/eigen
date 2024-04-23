import { DEFAULT_HIT_SLOP, Flex, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { PartnerOfferCreatedNotification_notification$key } from "__generated__/PartnerOfferCreatedNotification_notification.graphql"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { getTimer } from "app/utils/getTimer"
import { graphql, useFragment } from "react-relay"

interface PartnerOfferCreatedNotificationProps {
  notification: PartnerOfferCreatedNotification_notification$key
}

export const PartnerOfferCreatedNotification: React.FC<PartnerOfferCreatedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(PartnerOfferCreatedNotificationFragment, notification)

  const { headline, item, notificationType, artworksConnection, targetHref } = notificationData

  const { hasEnded } = getTimer(item?.partnerOffer?.endAt || "")
  const noLongerAvailable = !item?.partnerOffer?.isAvailable

  let subtitle = "Review the offer on your saved artwork"

  if (noLongerAvailable) {
    subtitle =
      "Sorry, this artwork has sold or is no longer available. Please create an alert or contact orders@artsy.net to find similar artworks"
  } else if (hasEnded) {
    subtitle = "This offer has expired. Please make a new offer or contact the gallery"
  }

  const handleManageSaves = () => {
    navigate("/artwork-lists")
  }

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Offers"
        rightElements={
          <Touchable haptic="impactLight" onPress={handleManageSaves} hitSlop={DEFAULT_HIT_SLOP}>
            <Text variant="xs">Manage Saves</Text>
          </Touchable>
        }
      />
      <Screen.Body fullwidth scroll>
        <Flex mt={2} mb={4}>
          <Flex mx={2}>
            <PartnerOfferBadge notificationType={notificationType} />

            <Spacer y={0.5} />

            <Text variant="lg-display">{headline}</Text>

            <Spacer y={0.5} />

            <Text variant="sm-display">{subtitle}</Text>

            <Spacer y={0.5} />

            {shouldDisplayExpiresInTimer(notificationType, item) && <ExpiresInTimer item={item} />}

            <Spacer y={2} />
          </Flex>

          <NotificationArtworkList
            artworksConnection={artworksConnection}
            priceOfferMessage={{
              priceListedMessage:
                extractNodes(artworksConnection)[0]?.price || "Not publicly listed",
              priceWithDiscountMessage: item?.partnerOffer?.priceWithDiscount?.display || "",
            }}
            partnerOffer={{
              endAt: item?.partnerOffer?.endAt || "",
              isAvailable: item?.partnerOffer?.isAvailable || false,
              targetHref: targetHref,
              note: item?.partnerOffer?.note || "",
              id: item?.partnerOffer?.internalID || "",
            }}
            showArtworkCommercialButtons
          />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const PartnerOfferCreatedNotificationFragment = graphql`
  fragment PartnerOfferCreatedNotification_notification on Notification {
    headline
    notificationType
    targetHref
    item {
      ... on PartnerOfferCreatedNotificationItem {
        expiresAt
        available
        partnerOffer {
          note
          internalID
          endAt
          isAvailable
          priceWithDiscount {
            display
          }
        }
      }
    }
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
      edges {
        node {
          price
        }
      }
    }
  }
`
