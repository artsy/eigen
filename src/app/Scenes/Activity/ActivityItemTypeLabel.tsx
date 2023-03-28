import { Text } from "@artsy/palette-mobile"

interface Props {
  notificationType: string
}

export const ActivityItemTypeLabel: React.FC<Props> = ({ notificationType }) => {
  const getNotificationType = () => {
    if (notificationType === "ARTWORK_ALERT") {
      return "Alert"
    }
    if (notificationType === "ARTICLE_FEATURED_ARTIST") {
      return "Artsy Editorial"
    }

    return null
  }
  const notificationTypeLabel = getNotificationType()
  const notificationTypeColor = notificationType == "ARTWORK_ALERT" ? "blue100" : "black60"

  return (
    <Text
      variant="xs"
      accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
      color={notificationTypeColor}
    >
      {notificationTypeLabel} •{" "}
    </Text>
  )
}
