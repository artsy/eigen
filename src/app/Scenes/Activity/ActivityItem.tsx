import { ActivityItem_item$key } from "__generated__/ActivityItem_item.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spacer, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { getDateLabel } from "./util/getDateLabel"

interface ActivityItemProps {
  item: ActivityItem_item$key
}

const UNREAD_INDICATOR_SIZE = 8

export const ActivityItem: React.FC<ActivityItemProps> = (props) => {
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

  return (
    <Flex p={2} flexDirection="row" alignItems="center">
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
            {getDateLabel(item.createdAt!)}
          </Text>
        </Flex>

        <Text variant="md" fontWeight="bold">
          {item.title}
        </Text>

        <Text variant="md">{item.message}</Text>

        <Spacer mb={1} />

        <Flex flexDirection="row" alignItems="center">
          {artworks.map((artwork) => {
            return (
              <Flex key={artwork.internalID} mr={1}>
                <OpaqueImageView imageURL={artwork.image?.url} width={58} height={58} />
              </Flex>
            )
          })}

          {remainingArtworksCount > 0 && (
            <Text variant="xs" color="black60" aria-label="Remaining artworks count">
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
          aria-label="Unread notification indicator"
        />
      )}
    </Flex>
  )
}

const activityItemFragment = graphql`
  fragment ActivityItem_item on Notification {
    title
    message
    createdAt
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
            url(version: "square")
          }
        }
      }
    }
  }
`
