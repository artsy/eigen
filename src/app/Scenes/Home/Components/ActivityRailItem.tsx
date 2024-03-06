import { Flex, Image, Text } from "@artsy/palette-mobile"
import {
  ActivityRailItem_item$data,
  ActivityRailItem_item$key,
} from "__generated__/ActivityRailItem_item.graphql"
import { ActivityItemTypeLabel } from "app/Scenes/Activity/ActivityItemTypeLabel"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ActivityRailItemProps {
  item: ActivityRailItem_item$key
  onPress?: (item: ActivityRailItem_item$data) => void
}

export const ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE = 55
const MAX_WIDTH = 220

export const ActivityRailItem: React.FC<ActivityRailItemProps> = (props) => {
  const enableNavigateToASingleNotification = useFeatureFlag("AREnableSingleActivityPanelScreen")
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")

  const markAsRead = useMarkNotificationAsRead()

  const item = useFragment(ActivityRailItemFragment, props.item)

  const handlePress = () => {
    props.onPress?.(item)

    markAsRead(item)

    navigateToActivityItem(item, enableNavigateToASingleNotification)
  }

  const imageURL = getPreviewImage(item)

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex flexDirection="row">
        <Flex
          mr={1}
          accessibilityLabel="Activity Artwork Image"
          width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
          height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
        >
          {!!imageURL && (
            <Image
              src={imageURL}
              width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
            />
          )}
        </Flex>

        <Flex maxWidth={MAX_WIDTH} overflow="hidden">
          <Flex flexDirection="row" style={{ marginTop: -4 }}>
            <ActivityItemTypeLabel notificationType={item.notificationType} />

            {item.notificationType !== "PARTNER_OFFER_CREATED" &&
              (enableNewActivityPanelManagement ? (
                <Text variant="xs" color="black60">
                  {" "}
                  • {item.publishedAt}
                </Text>
              ) : (
                <Text variant="xs" color="black60">
                  {item.publishedAt}
                </Text>
              ))}
          </Flex>

          <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
            {item.title}
          </Text>

          {item.notificationType !== "PARTNER_OFFER_CREATED" && (
            <Text variant="sm-display">{item.message}</Text>
          )}

          {shouldDisplayExpiresInTimer(item.notificationType, item.item) && (
            <ExpiresInTimer item={item.item} />
          )}
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

const getPreviewImage = (item: ActivityRailItem_item$data) => {
  switch (item.notificationType) {
    case "VIEWING_ROOM_PUBLISHED":
      return extractNodes(item?.item?.viewingRoomsConnection)?.[0]?.image?.imageURLs?.normalized
    case "ARTICLE_FEATURED_ARTIST":
      return item?.item?.article?.thumbnailImage?.preview?.src
    case "PARTNER_SHOW_OPENED":
      return extractNodes(item?.item?.showsConnection)?.[0]?.coverImage?.preview?.src
    default:
      return extractNodes(item?.artworksConnection)?.[0]?.image?.preview?.src
  }
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
            preview: cropped(width: 55, height: 55, version: "normalized") {
              src
            }
          }
        }
      }
    }
    item {
      ... on PartnerOfferCreatedNotificationItem {
        available
        expiresAt
      }
      ... on ViewingRoomPublishedNotificationItem {
        viewingRoomsConnection(first: 1) {
          edges {
            node {
              image {
                imageURLs {
                  normalized
                }
              }
            }
          }
        }
      }
      ... on ArticleFeaturedArtistNotificationItem {
        article {
          thumbnailImage {
            preview: cropped(width: 55, height: 55, version: "normalized") {
              src
            }
          }
        }
      }
      ... on ShowOpenedNotificationItem {
        showsConnection(first: 1) {
          edges {
            node {
              coverImage {
                preview: cropped(width: 55, height: 55, version: "normalized") {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`
