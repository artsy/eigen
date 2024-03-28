import { FC } from "react"
import { useFragment, graphql } from "react-relay"
import { PartnerShowOpenedNotification_notification$key } from "__generated__/PartnerShowOpenedNotification_notification.graphql"
import { Button, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { NotificationArtworkList } from "app/Scenes/Activity/components/NotificationArtworkList"
import { goBack, navigate } from "app/system/navigation/navigate"
import { ScrollView, TouchableOpacity } from "react-native"
import { extractNodes } from "app/utils/extractNodes"
import { ActivityErrorScreen } from "app/Scenes/Activity/components/ActivityErrorScreen"

interface PartnerShowOpenedNotificationProps {
  notification: PartnerShowOpenedNotification_notification$key
}

export const PartnerShowOpenedNotification: FC<PartnerShowOpenedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(PartnerShowOpenedNotificationFragment, notification)

  const { headline, item } = notificationData

  const partner = item?.partner
  const shows = extractNodes(item?.showsConnection)
  const show = shows[0]
  const artworksConnection = show?.artworksConnection

  if (!partner || !show) {
    return <ActivityErrorScreen headerTitle={"TODO"} />
  }

  const handleVisitShowPress = () => {
    if (!show.href) return

    navigate(show.href)
  }
  const handlePartnerNamePress = () => {
    if (!partner.href) return

    navigate(partner.href)
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Alerts" />
      <ScrollView>
        <Text variant="lg-display">{headline}</Text>
        <Text variant="xs">
          Presented by{" "}
          <TouchableOpacity onPress={handlePartnerNamePress}>{partner.name}</TouchableOpacity>
        </Text>
        <Text variant="xs">Show • {"March 1 – April 1, 2024"}</Text>

        <Spacer y={1} />

        <Spacer y={4} />

        <NotificationArtworkList artworksConnection={artworksConnection} />

        <Spacer y={4} />

        <Button
          block
          variant="outline"
          onPress={handleVisitShowPress}
          testID="visit-show-CTA"
          mb={1}
        >
          Visit Show
        </Button>
      </ScrollView>
    </Screen>
  )
}

export const PartnerShowOpenedNotificationFragment = graphql`
  fragment PartnerShowOpenedNotification_notification on Notification {
    headline
    item {
      ... on ShowOpenedNotificationItem {
        partner {
          href
          name
        }
        showsConnection {
          edges {
            node {
              artworksConnection(first: 2) {
                ...NotificationArtworkList_artworksConnection
                totalCount
              }
              href
              internalID
            }
          }
        }
      }
    }
    notificationType
    publishedAt(format: "RELATIVE")
  }
`
