import { Flex, Text, Screen } from "@artsy/palette-mobile"
import { FollowNotification_notification$key } from "__generated__/FollowNotification_notification.graphql"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

interface FollowNotificationProps {
  notification: FollowNotification_notification$key
}
export const FollowNotification: FC<FollowNotificationProps> = ({ notification }) => {
  const notificationData = useFragment(followNotificationFragment, notification)
  const { message, item } = notificationData

  return (
    <Screen>
      <Screen.Header onBack={goBack} title="Follows" />

      <Flex m={2}>
        <Text variant="lg-display" mb={2}>
          {message}
        </Text>

        <Text>Artist: {item?.artists?.[0]?.name}</Text>
      </Flex>
    </Screen>
  )
}

export const followNotificationFragment = graphql`
  fragment FollowNotification_notification on Notification {
    message

    item {
      ... on ArtworkPublishedNotificationItem {
        artists {
          name
        }
      }
    }
  }
`
