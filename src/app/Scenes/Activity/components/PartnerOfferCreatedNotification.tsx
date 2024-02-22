import { Flex, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { goBack, navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface PartnerOfferCreatedNotificationProps {
  notification: any
}

export const PartnerOfferCreatedNotification: React.FC<PartnerOfferCreatedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(PartnerOfferCreatedNotificationFragment, notification)

  const { headline, item, notificationType, artworksConnection, targetHref } = notificationData

  const handleManageSaves = () => {
    navigate("/artwork-lists")
  }

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Offers"
        rightElements={
          <Touchable haptic="impactLight" onPress={handleManageSaves}>
            <Flex width={100} height="100%" justifyContent="center">
              <Text textAlign="right" variant="xs">
                Manage Saves
              </Text>
            </Flex>
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

            <Text variant="sm-display">Review the offer on your saved artwork</Text>

            <Spacer y={0.5} />

            {shouldDisplayExpiresInTimer(notificationType, item) && <ExpiresInTimer item={item} />}

            <Spacer y={2} />
          </Flex>

          <NotificationArtworkList
            artworksConnection={artworksConnection}
            priceOfferMessage={{
              priceListedMessage: item.partnerOffer.priceListedMessage,
              priceWithDiscountMessage: item.partnerOffer.priceWithDiscountMessage,
            }}
            partnerOffer={{
              endAt: item.partnerOffer.endAt,
              isAvailable: item.partnerOffer.isAvailable,
              targetHref: targetHref,
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
          endAt
          isAvailable
          priceListedMessage
          priceWithDiscountMessage
        }
      }
    }
    artworksConnection(first: 10) {
      ...NotificationArtworkList_artworksConnection
    }
  }
`
