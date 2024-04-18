import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelNotificationItem } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ActivityItem_notification$key } from "__generated__/ActivityItem_notification.graphql"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { memo } from "react"
import { TouchableOpacity } from "react-native"
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
  (props) => {
    const enableBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

    const markAsRead = useMarkNotificationAsRead()
    const tracking = useTracking()
    const item = useFragment(activityItemFragment, props.notification)
    const artworksCount = item.objectsCount
    const remainingArtworksCount = artworksCount - 4
    const shouldDisplayCounts =
      isArtworksBasedNotification(item.notificationType) && remainingArtworksCount > 0
    const isPartnerOffer = item.notificationType === "PARTNER_OFFER_CREATED"
    const isEditorial = item.notificationType === "ARTICLE_FEATURED_ARTIST"

    const handlePress = () => {
      tracking.trackEvent(tracks.tappedNotification(item.notificationType))

      if (item.isUnread) {
        markAsRead(item)
      }

      navigateToActivityItem(item)
    }

    const showAsRow = isPartnerOffer

    return (
      <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
        <Flex flexDirection="row" alignItems="center" px={2}>
          <Flex flex={1} mr={2}>
            <Flex flexDirection="column" py={2}>
              <Flex flexDirection={showAsRow ? "row" : "column"}>
                <Flex flexDirection="row" alignItems="center">
                  {item.previewImages.map((image) => {
                    if (!image.url) return null

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
                          showLoadingState={!props.isVisible}
                          blurhash={enableBlurhash ? image.blurhash : undefined}
                        />
                      </Flex>
                    )
                  })}

                  {!!shouldDisplayCounts && (
                    <Text
                      variant="xs"
                      color="black60"
                      accessibilityLabel="Remaining artworks count"
                    >
                      + {remainingArtworksCount}
                    </Text>
                  )}
                </Flex>

                <Flex>
                  {!!isPartnerOffer && (
                    <PartnerOfferBadge notificationType={item.notificationType} />
                  )}

                  <Text variant="sm-display" fontWeight="bold">
                    {item.headline}
                  </Text>

                  {!!isEditorial && <Text variant="xs">{item.message}</Text>}

                  <Flex flexDirection="row" mt="1px">
                    <ActivityItemTypeLabel notificationType={item.notificationType} />
                    {!isPartnerOffer && (
                      <Text variant="xs" mr={0.5}>
                        {item.publishedAt}
                      </Text>
                    )}
                    {shouldDisplayExpiresInTimer(item.notificationType, item.item) && (
                      <Flex ml="1px">
                        <ExpiresInTimer item={item.item} />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {!!item.isUnread && (
            <Flex
              width={UNREAD_INDICATOR_SIZE}
              height={UNREAD_INDICATOR_SIZE}
              borderRadius={UNREAD_INDICATOR_SIZE / 2}
              bg="blue100"
              accessibilityLabel="Unread notification indicator"
            />
          )}
        </Flex>
      </TouchableOpacity>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.isVisible === nextProps.isVisible
  }
)

const activityItemFragment = graphql`
  fragment ActivityItem_notification on Notification {
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
