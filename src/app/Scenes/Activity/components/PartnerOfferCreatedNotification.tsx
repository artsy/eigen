import { Flex, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { ExpiresInTimer } from "app/Scenes/Activity/components/ExpiresInTimer"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { goBack, navigate } from "app/system/navigation/navigate"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

interface PartnerOfferCreatedNotificationProps {
  notification: any
}

export const PartnerOfferCreatedNotification: React.FC<PartnerOfferCreatedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(PartnerOfferCreatedNotificationFragment, notification)

  const { headline, item, notificationType, artworksConnection } = notificationData

  console.warn(artworksConnection?.totalCount)

  const handleManageSaves = () => {
    navigate("/setting/alerts")
  }

  // TODO: 'Manage Saves' string is too long for the right header element

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Offers"
        rightElements={
          <Touchable haptic="impactLight" onPress={handleManageSaves}>
            <Flex height="100%" justifyContent="center">
              <Text textAlign="right" variant="xs">
                Manage Saves
              </Text>
            </Flex>
          </Touchable>
        }
      />
      <ScrollView>
        <Flex mt={2} mb={4}>
          <Flex mx={2}>
            <PartnerOfferBadge notificationType={notificationType} />

            <Spacer y={1} />

            <Text variant="lg-display">{headline}</Text>

            <Spacer y={1} />

            <Text variant="sm-display">Review the offer on your saved artwork</Text>

            <Spacer y={1} />

            <ExpiresInTimer item={item} />

            <Spacer y={2} />
          </Flex>
          <NotificationArtworkList artworksConnection={artworksConnection} showOnlyFirstArtwork />
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const PartnerOfferCreatedNotificationFragment = graphql`
  fragment PartnerOfferCreatedNotification_notification on Notification {
    headline
    notificationType
    item {
      ... on PartnerOfferCreatedNotificationItem {
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
      totalCount
    }
  }
`
