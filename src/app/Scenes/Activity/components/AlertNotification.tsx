import { Flex, Text, Screen, Touchable } from "@artsy/palette-mobile"
import { AlertNotification_notification$key } from "__generated__/AlertNotification_notification.graphql"
import { goBack } from "app/system/navigation/navigate"
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
    <Screen>
      <Screen.Header
        onBack={goBack}
        title="Alerts"
        rightElements={
          <Touchable>
            <Text variant="sm" onPress={handleEditPress}>
              Edit Alert
            </Text>
          </Touchable>
        }
      />

      <Flex m={2}>
        <Text variant="lg-display" mb={2}>
          {message}
        </Text>

        <Text>Alert ID: {item?.alert?.internalID}</Text>
      </Flex>
    </Screen>
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
