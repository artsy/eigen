import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelNotificationItem } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ActivityItem_notification$key } from "__generated__/ActivityItem_notification.graphql"
import { CollectorUpdateNotification } from "app/Scenes/Activity/components/CollectorUpdateNotification"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { getActivityItemHref } from "app/Scenes/Activity/utils/getActivityItemHref"
import { RouterLink } from "app/system/navigation/RouterLink"
import { memo } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { ActivityItemTypeLabel } from "./ActivityItemTypeLabel"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityItemProps {
  notification: ActivityItem_notification$key
  isVisible?: boolean
}

const UNREAD_INDICATOR_SIZE = 8
const NEW_ARTWORK_IMAGE_SIZE = 60

export const ActivityItem: React.FC<ActivityItemProps> = memo(
  ({ isVisible, notification: _notification }) => {
    const markAsRead = useMarkNotificationAsRead()
    const tracking = useTracking()
    const notification = useFragment(activityItemFragment, _notification)
    const artworksCount = notification.objectsCount
    const remainingArtworksCount = artworksCount - 4
    const shouldDisplayCounts =
      isArtworksBasedNotification(notification.notificationType) && remainingArtworksCount > 0
    const isPartnerOffer = notification.notificationType === "PARTNER_OFFER_CREATED"
    const isEditorial = notification.notificationType === "ARTICLE_FEATURED_ARTIST"
    const isCollectorProfileUpdate =
      notification.item?.__typename === "CollectorProfileUpdatePromptNotificationItem"

    const handlePress = () => {
      tracking.trackEvent(tracks.tappedNotification(notification.notificationType))

      if (notification.isUnread) {
        markAsRead(notification)
      }
    }

    const showAsRow = isPartnerOffer

    const { href, passProps } = getActivityItemHref(notification)

    return (
      <RouterLink
        onPress={handlePress}
        to={isCollectorProfileUpdate ? undefined : href}
        navigationProps={passProps}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" px={2}>
          {!!isCollectorProfileUpdate ? (
            <CollectorUpdateNotification
              notification={notification}
              item={notification.item}
              onPress={handlePress}
            />
          ) : (
            <Flex flex={1} pr={2}>
              <Flex flexDirection="column" py={2}>
                <Flex flexDirection={showAsRow ? "row" : "column"}>
                  <Flex flexDirection="row" alignItems="center">
                    {notification.previewImages.map((image) => {
                      if (!image?.url) return null

                      return (
                        <Flex
                          key={image.url}
                          mr={1}
                          mb={1}
                          accessibilityLabel="Activity Artwork Image"
                          height={NEW_ARTWORK_IMAGE_SIZE}
                          width={NEW_ARTWORK_IMAGE_SIZE}
                        >
                          <Image
                            src={image.url}
                            width={NEW_ARTWORK_IMAGE_SIZE}
                            height={NEW_ARTWORK_IMAGE_SIZE}
                            showLoadingState={!isVisible}
                            blurhash={image.blurhash}
                          />
                        </Flex>
                      )
                    })}

                    {!!shouldDisplayCounts && (
                      <Text
                        variant="xs"
                        color="mono60"
                        accessibilityLabel="Remaining artworks count"
                      >
                        + {remainingArtworksCount}
                      </Text>
                    )}
                  </Flex>

                  <Flex style={{ flex: 1 }}>
                    {!!isPartnerOffer && (
                      <PartnerOfferBadge notificationType={notification.notificationType} />
                    )}

                    <Text variant="sm-display" fontWeight="bold">
                      {notification.headline}
                    </Text>

                    {!!isEditorial && <Text variant="xs">{notification.message}</Text>}

                    <Flex flexDirection="row" mt="1px">
                      <ActivityItemTypeLabel notificationType={notification.notificationType} />
                      {!isPartnerOffer && (
                        <Text variant="xs" mr={0.5}>
                          {notification.publishedAt}
                        </Text>
                      )}
                      {shouldDisplayExpiresInTimer(
                        notification.notificationType,
                        notification.item
                      ) && (
                        <Flex ml="1px">
                          <ExpiresInTimer item={notification.item} />
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}
          {!!notification.isUnread && (
            <Flex
              width={UNREAD_INDICATOR_SIZE}
              height={UNREAD_INDICATOR_SIZE}
              borderRadius={UNREAD_INDICATOR_SIZE / 2}
              bg="blue100"
              accessibilityLabel="Unread notification indicator"
            />
          )}
        </Flex>
      </RouterLink>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.isVisible === nextProps.isVisible
  }
)

const activityItemFragment = graphql`
  fragment ActivityItem_notification on Notification {
    ...CollectorUpdateNotification_notification

    internalID
    id
    title
    headline
    message
    publishedAt(format: "RELATIVE")
    targetHref
    isUnread
    notificationType
    objectsCount

    item {
      __typename
      ... on CollectorProfileUpdatePromptNotificationItem {
        ...CollectorUpdateNotification_item
        __typename
      }
      ... on PartnerOfferCreatedNotificationItem {
        available
        expiresAt
      }
    }

    previewImages(size: 4) {
      url(version: "thumbnail")
      blurhash
    }
  }
`

const tracks = {
  tappedNotification: (notificationType: string): ClickedActivityPanelNotificationItem => ({
    action: ActionType.clickedActivityPanelNotificationItem,
    notification_type: notificationType,
  }),
}
