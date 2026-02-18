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
import { getActivityItemHref } from "app/Scenes/Activity/utils/getActivityItemHref"
import { RouterLink } from "app/system/navigation/RouterLink"
import { memo } from "react"
import { graphql, useFragment } from "react-relay"

interface ActivityRailItemProps {
  item: ActivityRailItem_item$key
  onPress?: (item: ActivityRailItem_item$data) => void
}

export const ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE = 60
export const ACTIVITY_RAIL_ITEM_WIDTH = 240

export const ActivityRailItem: React.FC<ActivityRailItemProps> = memo((props) => {
  const markAsRead = useMarkNotificationAsRead()

  const item = useFragment(ActivityRailItemFragment, props.item)

  const handlePress = () => {
    props.onPress?.(item)

    markAsRead(item)
  }

  const image = item.previewImages[0]

  const isPartnerOffer = item.notificationType === "PARTNER_OFFER_CREATED"
  const isEditorial = item.notificationType === "ARTICLE_FEATURED_ARTIST"

  if (item.item?.__typename === "CollectorProfileUpdatePromptNotificationItem") {
    return null
  }

  const { href, passProps } = getActivityItemHref(item)

  return (
    <RouterLink onPress={handlePress} to={href} navigationProps={passProps}>
      <Flex flexDirection="row" width={ACTIVITY_RAIL_ITEM_WIDTH}>
        <Flex
          mr={1}
          accessibilityLabel="Activity Artwork Image"
          width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
          height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
        >
          {!!image?.url && (
            <Image
              src={image.url}
              width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              blurhash={image.blurhash}
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

            {item.notificationType !== "PARTNER_OFFER_CREATED" && (
              <Text variant="xs">{item.publishedAt}</Text>
            )}

            {shouldDisplayExpiresInTimer(item.notificationType, item.item) && (
              <ExpiresInTimer item={item.item} />
            )}
          </Flex>
        </Flex>
      </Flex>
    </RouterLink>
  )
})

interface HeadlineProps {
  headline: string
  notificationType: NotificationTypesEnum
}

const Headline: React.FC<HeadlineProps> = ({ headline, notificationType }) => {
  let text = headline

  if (["ARTWORK_ALERT", "ARTWORK_PUBLISHED"].includes(notificationType)) {
    const split = headline.split(" by ")
    text = split[0] + " by \n" + split[1]
  } else if (["PARTNER_SHOW_OPENED"].includes(notificationType)) {
    const split = headline.split(" at ")
    text = split[0] + " at \n" + split[1]
  } else if (["PARTNER_OFFER_CREATED"].includes(notificationType)) {
    text = headline.split(" by ")[1]
  } else if (["VIEWING_ROOM_PUBLISHED"].includes(notificationType)) {
    const split = headline.split(" published by ")
    text = split[0] + " by \n" + split[1]
  }

  return (
    <Text variant="sm-display" fontWeight="bold" ellipsizeMode="tail" numberOfLines={2}>
      {text}
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
      __typename
      ... on CollectorProfileUpdatePromptNotificationItem {
        __typename
      }
      ... on PartnerOfferCreatedNotificationItem {
        available
        expiresAt
      }
    }
    notificationType
    objectsCount
    previewImages(size: 1) {
      blurhash
      url(version: "thumbnail")
    }
  }
`
