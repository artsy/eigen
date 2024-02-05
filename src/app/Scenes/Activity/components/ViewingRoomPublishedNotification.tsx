import { Flex, FollowButton, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ViewingRoomPublishedNotification_notification$key } from "__generated__/ViewingRoomPublishedNotification_notification.graphql"
import { NotificationViewingRoomsList } from "app/Scenes/Activity/components/ViewingRoomPublishedNotificationsList"
import { goBack } from "app/system/navigation/navigate"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { ScrollView } from "react-native"
import { useFragment, graphql } from "react-relay"

interface ViewingRoomPublishedNotificationProps {
  notification: ViewingRoomPublishedNotification_notification$key
}

export const ViewingRoomPublishedNotification: React.FC<ViewingRoomPublishedNotificationProps> = ({
  notification,
}) => {
  const notificationData = useFragment(ViewingRoomPublishedNotificationFragment, notification)

  const { headline, item } = notificationData

  const { followProfile, isInFlight } = useFollowProfile({
    id: item?.partner?.profile?.id ?? "",
    internalID: item?.partner?.profile?.internalID ?? "",
    isFollowd: item?.partner?.profile?.isFollowed ?? false,
  })

  const partner = item?.partner
  const profile = partner?.profile

  if (!profile) {
    return (
      <Text variant="lg" m={4}>
        Sorry, something went wrong.
      </Text>
    )
  }

  const handleFollowPartner = () => {
    followProfile()
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Viewing Room" />
      <ScrollView>
        <Flex mx={2} mt={2} mb={4}>
          <Text variant="lg-display">{headline}</Text>
          <Spacer y={2} />
          <FollowButton
            haptic
            isFollowed={!!profile?.isFollowed}
            onPress={handleFollowPartner}
            disabled={isInFlight}
            mr={1}
          />
          <Spacer y={4} />
          <NotificationViewingRoomsList viewingRoomsConnection={item?.viewingRoomsConnection} />
        </Flex>
      </ScrollView>
    </Screen>
  )
}

export const ViewingRoomPublishedNotificationFragment = graphql`
  fragment ViewingRoomPublishedNotification_notification on Notification {
    headline
    item {
      ... on ViewingRoomPublishedNotificationItem {
        partner {
          name
          href
          profile {
            id
            internalID
            isFollowed
            image {
              url(version: "wide")
            }
          }
        }
        viewingRoomsConnection(first: 10) {
          ...ViewingRoomPublishedNotificationsList_viewingRoomsConnection
        }
      }
    }
    notificationType
    publishedAt(format: "RELATIVE")
  }
`
