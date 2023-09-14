import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelNotificationItem } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Flex, Text } from "@artsy/palette-mobile"
import { ActivityRailItem_item$key } from "__generated__/ActivityRailItem_item.graphql"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { last } from "lodash"
import { parse as parseQueryString } from "query-string"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityRailItemProps {
  item: ActivityRailItem_item$key
}

export const ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE = 55

export const ActivityRailItem: React.FC<ActivityRailItemProps> = (props) => {
  const tracking = useTracking()
  const item = useFragment(ActivityRailItemFragment, props.item)
  const artworks = extractNodes(item.artworksConnection)
  const remainingArtworksCount = item.objectsCount - 4
  const shouldDisplayCounts =
    isArtworksBasedNotification(item.notificationType) && remainingArtworksCount > 0

  const handlePress = () => {
    const splittedQueryParams = item.targetHref.split("?")
    const queryParams = last(splittedQueryParams) ?? ""
    const parsed = parseQueryString(queryParams)

    const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
      (sortEntity) => sortEntity.paramValue === "-published_at"
    )!

    tracking.trackEvent(tracks.tappedNotification(item.notificationType))

    navigate(item.targetHref, {
      passProps: {
        predefinedFilters: [sortFilterItem] as FilterArray,
        searchCriteriaID: parsed.search_criteria_id,
      },
    })
  }

  const notificationTypeLabel = getNotificationTypeLabel(item.notificationType)

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex flexDirection="row">
        <Flex mr={1} accessibilityLabel="Activity Artwork Image">
          <OpaqueImageView
            imageURL={artworks[0].image?.preview?.src}
            width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
            height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
          />
        </Flex>

        <Flex>
          <Flex flexDirection="row" style={{ marginTop: -4 }}>
            <Text variant="xs" fontWeight="bold">
              {notificationTypeLabel}{" "}
            </Text>
            <Text variant="xs">{item.publishedAt}</Text>
          </Flex>

          <Text variant="sm-display" fontWeight="bold">
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

const tracks = {
  tappedNotification: (notificationType: string): ClickedActivityPanelNotificationItem => ({
    action: ActionType.clickedActivityPanelNotificationItem,
    notification_type: notificationType,
  }),
}

const getNotificationTypeLabel = (notificationType: string) => {
  if (notificationType === "ARTWORK_ALERT") {
    return "Alert"
  }
  if (notificationType === "ARTICLE_FEATURED_ARTIST") {
    return "Artsy Editorial"
  }
  if (notificationType === "ARTWORK_PUBLISHED") {
    return "Artist"
  }
  if (notificationType === "PARTNER_SHOW_OPENED") {
    return "Gallery"
  }

  return null
}
