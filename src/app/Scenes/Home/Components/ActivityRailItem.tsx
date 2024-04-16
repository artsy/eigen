import { Flex, Image, Text } from "@artsy/palette-mobile"
import {
  ActivityRailItem_item$data,
  ActivityRailItem_item$key,
  NotificationTypesEnum,
} from "__generated__/ActivityRailItem_item.graphql"
import { ActivityItemTypeLabel } from "app/Scenes/Activity/ActivityItemTypeLabel"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { PartnerOfferBadge } from "app/Scenes/Activity/components/PartnerOffeBadge"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ActivityRailItemProps {
  item: ActivityRailItem_item$key
  onPress?: (item: ActivityRailItem_item$data) => void
}

export const ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE = 60
const ACTIVITY_RAIL_ITEM_WIDTH = 240

export const ActivityRailItem: React.FC<ActivityRailItemProps> = (props) => {
  const enableNavigateToASingleNotification = useFeatureFlag("AREnableSingleActivityPanelScreen")
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")
  const enableBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const markAsRead = useMarkNotificationAsRead()

  const item = useFragment(ActivityRailItemFragment, props.item)

  const handlePress = () => {
    props.onPress?.(item)

    markAsRead(item)

    navigateToActivityItem(item, enableNavigateToASingleNotification)
  }

  const image = item.previewImages[0]

  const isPartnerOffer = item.notificationType === "PARTNER_OFFER_CREATED"
  const isEditorial = item.notificationType === "ARTICLE_FEATURED_ARTIST"

  if (!enableNewActivityPanelManagement) {
    return (
      <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
        <Flex flexDirection="row" width={ACTIVITY_RAIL_ITEM_WIDTH} overflowX="hidden">
          <Flex
            mr={1}
            accessibilityLabel="Activity Artwork Image"
            width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
            height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
          >
            {!!image.url && (
              <Image
                src={image.url}
                width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
                height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
                blurhash={enableBlurhash ? image.blurhash : undefined}
              />
            )}
          </Flex>

          <Flex flex={1} overflow="hidden">
            <Flex flexDirection="row">
              <ActivityItemTypeLabel notificationType={item.notificationType} />

              {item.notificationType !== "PARTNER_OFFER_CREATED" && (
                <Text variant="xs">{item.publishedAt}</Text>
              )}
            </Flex>

            <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
              {item.title}
            </Text>

            {item.notificationType !== "PARTNER_OFFER_CREATED" && (
              <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
                {item.message}
              </Text>
            )}

            {shouldDisplayExpiresInTimer(item.notificationType, item.item) && (
              <ExpiresInTimer item={item.item} />
            )}
          </Flex>
        </Flex>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex flexDirection="row" width={ACTIVITY_RAIL_ITEM_WIDTH}>
        <Flex
          mr={1}
          accessibilityLabel="Activity Artwork Image"
          width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
          height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
        >
          {!!image.url && (
            <Image
              src={image.url}
              width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              blurhash={enableBlurhash ? image.blurhash : undefined}
            />
          )}
        </Flex>

        <Flex flex={1} overflow="hidden">
          {!!isPartnerOffer && <PartnerOfferBadge notificationType={item.notificationType} />}

          <Headline headline={item.headline} notificationType={item.notificationType} />

          {!!isEditorial && (
            <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
              {item.message}
            </Text>
          )}

          <Flex flexDirection="row" mt="1px">
            <ActivityItemTypeLabel notificationType={item.notificationType} />

            {item.notificationType !== "PARTNER_OFFER_CREATED" &&
              (enableNewActivityPanelManagement ? (
                <Text variant="xs">{item.publishedAt}</Text>
              ) : (
                <Text variant="xs" color="black60">
                  {item.publishedAt}
                </Text>
              ))}

            {shouldDisplayExpiresInTimer(item.notificationType, item.item) && (
              <ExpiresInTimer item={item.item} />
            )}
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

interface HeadlineProps {
  headline: string
  notificationType: NotificationTypesEnum
}

const Headline: React.FC<HeadlineProps> = ({ headline, notificationType }) => {
  if (["ARTWORK_ALERT", "ARTWORK_PUBLISHED"].includes(notificationType)) {
    // Splitting the headline by " by " to display the artist name on a new line
    return (
      <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={2}>
        {headline.split(" by ")[0] + " by \n" + headline.split(" by ")[1]}
      </Text>
    )
  }

  if (["PARTNER_OFFER_CREATED"].includes(notificationType)) {
    // Splitting the headline by " by " to only display the artist name
    return (
      <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
        {headline.split(" by ")[1]}
      </Text>
    )
  }

  return (
    <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={1}>
      {headline}
    </Text>
  )
}

const ActivityRailItemFragment = graphql`
  fragment ActivityRailItem_item on Notification {
    internalID
    id
    headline
    title
    message
    publishedAt(format: "RELATIVE")
    targetHref
    isUnread
    item {
      ... on PartnerOfferCreatedNotificationItem {
        available
        expiresAt
      }
    }
    notificationType
    objectsCount
    previewImages(size: 1) @optionalField {
      blurhash
      url(version: "thumbnail")
    }
  }
`
