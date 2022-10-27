import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelNotificationItem } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { ActivityItem_item$key } from "__generated__/ActivityItem_item.graphql"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, OpaqueImageView, Spacer, Text } from "palette"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityItemProps {
  item: ActivityItem_item$key
}

const UNREAD_INDICATOR_SIZE = 8

export const ActivityItem: React.FC<ActivityItemProps> = (props) => {
  const tracking = useTracking()
  const item = useFragment(activityItemFragment, props.item)
  const artworks = extractNodes(item.artworksConnection)
  const remainingArtworksCount = (item.artworksConnection?.totalCount ?? 0) - 4

  const getNotificationType = () => {
    if (item.notificationType === "ARTWORK_ALERT") {
      return "Alert"
    }

    return null
  }
  const notificationTypeLabel = getNotificationType()

  const handlePress = () => {
    navigate(item.targetHref)
    tracking.trackEvent(tracks.tappedNotification(item.notificationType))
  }

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex py={2} flexDirection="row" alignItems="center">
        <Flex flex={1}>
          <Flex flexDirection="row">
            {!!notificationTypeLabel && (
              <Text
                color="blue100"
                variant="xs"
                accessibilityLabel={`Notification type: ${notificationTypeLabel}`}
              >
                {notificationTypeLabel} •{" "}
              </Text>
            )}

            <Text variant="xs" color="black60">
              {item.publishedAt}
            </Text>
          </Flex>

          <Text variant="sm-display" fontWeight="bold">
            {item.title}
          </Text>

          <Text variant="sm-display">{item.message}</Text>

          <Spacer mb={1} />

          <Flex flexDirection="row" alignItems="center">
            {artworks.map((artwork) => {
              return (
                <Flex key={artwork.internalID} mr={1} accessibilityLabel="Activity Artwork Image">
                  <OpaqueImageView imageURL={artwork.image?.preview?.src} width={58} height={58} />
                </Flex>
              )
            })}

            {remainingArtworksCount > 0 && (
              <Text variant="xs" color="black60" accessibilityLabel="Remaining artworks count">
                + {remainingArtworksCount}
              </Text>
            )}
          </Flex>
        </Flex>

        {!!item.isUnread && (
          <Flex
            width={UNREAD_INDICATOR_SIZE}
            height={UNREAD_INDICATOR_SIZE}
            borderRadius={UNREAD_INDICATOR_SIZE / 2}
            ml={1}
            bg="blue100"
            accessibilityLabel="Unread notification indicator"
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}

const activityItemFragment = graphql`
  fragment ActivityItem_item on Notification {
    title
    message
    publishedAt(format: "RELATIVE")
    targetHref
    isUnread
    notificationType
    artworksConnection(first: 4) {
      totalCount
      edges {
        node {
          internalID
          title
          image {
            aspectRatio
            preview: cropped(width: 116, height: 116, version: "normalized") {
              src
            }
          }
        }
      }
    }
  }
`

const tracks = {
  tappedNotification: (notificationType: string): ClickedActivityPanelNotificationItem => ({
    action: ActionType.clickedActivityPanelNotificationItem,
    notification_type: notificationType,
  }),
}
