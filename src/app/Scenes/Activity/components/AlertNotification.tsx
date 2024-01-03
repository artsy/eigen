import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { AlertNotification_notification$key } from "__generated__/AlertNotification_notification.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

interface AlertNotificationProps {
  notification: AlertNotification_notification$key
}
export const AlertNotification: FC<AlertNotificationProps> = ({ notification }) => {
  const notificationData = useFragment(alertNotificationFragment, notification)
  const { item, message } = notificationData

  if (!item?.alert) {
    return null
  }

  const handleEditPress = () => {
    // TODO: implement
  }

  return (
    <PageWithSimpleHeader
      title="Alerts"
      titleWeight="regular"
      right={
        <Touchable>
          <Text onPress={handleEditPress}>Edit Alert</Text>
        </Touchable>
      }
      noSeparator
    >
      <Flex m={2}>
        <Text variant="lg-display" mb={2}>
          {message}
        </Text>

        <Text>Alert ID: {item?.alert?.internalID}</Text>
      </Flex>
    </PageWithSimpleHeader>
  )
}

export const alertNotificationFragment = graphql`
  fragment AlertNotification_notification on Notification {
    message

    item {
      ... on AlertNotificationItem {
        alert {
          internalID
        }
      }
    }
  }
`
