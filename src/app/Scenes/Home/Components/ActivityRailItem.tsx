import { Flex, Text } from "@artsy/palette-mobile"
import {
  ActivityRailItem_item$data,
  ActivityRailItem_item$key,
} from "__generated__/ActivityRailItem_item.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { getNotificationTypeLabel } from "app/Scenes/Activity/utils/getNotificationTypeLabel"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { extractNodes } from "app/utils/extractNodes"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ActivityRailItemProps {
  item: ActivityRailItem_item$key
  onPress?: (item: ActivityRailItem_item$data) => void
}

export const ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE = 55
const MAX_WIDTH = 220

export const ActivityRailItem: React.FC<ActivityRailItemProps> = (props) => {
  const markAsRead = useMarkNotificationAsRead()

  const item = useFragment(ActivityRailItemFragment, props.item)
  const artworks = extractNodes(item.artworksConnection)

  const handlePress = () => {
    props.onPress?.(item)

    markAsRead(item)

    navigateToActivityItem(item.targetHref)
  }

  const imageURL = artworks[0]?.image?.preview?.src

  const notificationTypeLabel = getNotificationTypeLabel(item.notificationType)

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex flexDirection="row">
        {!!imageURL ? (
          <Flex mr={1} accessibilityLabel="Activity Artwork Image">
            <OpaqueImageView
              imageURL={imageURL}
              width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
            />
          </Flex>
        ) : null}

        <Flex maxWidth={MAX_WIDTH} overflow="hidden">
          <Flex flexDirection="row" style={{ marginTop: -4 }}>
            {!!notificationTypeLabel && (
              <Text variant="xs" fontWeight="bold">
                {notificationTypeLabel}{" "}
              </Text>
            )}
            <Text variant="xs">{item.publishedAt}</Text>
          </Flex>

          <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
            {item.title}
          </Text>
          <Text variant="sm-display">{item.message}</Text>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

const ActivityRailItemFragment = graphql`
  fragment ActivityRailItem_item on Notification {
    internalID
    id
    title
    message
    publishedAt(format: "RELATIVE")
    targetHref
    isUnread
    notificationType
    objectsCount
    artworksConnection(first: 1) {
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
