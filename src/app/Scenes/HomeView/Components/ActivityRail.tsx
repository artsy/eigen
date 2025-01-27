import { Flex, Spacer } from "@artsy/palette-mobile"
import { ActivityRail_viewer$key } from "__generated__/ActivityRail_viewer.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { ActivityRailItem } from "app/Scenes/HomeView/Components/ActivityRailItem"
import { SeeAllCard } from "app/Scenes/HomeView/Components/SeeAllCard"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityRailProps {
  title: string
  viewer: ActivityRail_viewer$key | null
}

const ACTIVITY_SCREEN_ROUTE = "/notifications"

export const ActivityRail: React.FC<ActivityRailProps> = ({ title, viewer }) => {
  const { trackEvent } = useTracking()

  const data = useFragment(notificationsConnectionFragment, viewer)

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter(shouldDisplayNotification)

  if (notifications.length === 0) {
    return null
  }

  const handleMorePress = () => {
    trackEvent(HomeAnalytics.activityViewAllTapEvent())
  }

  return (
    <Flex pt={2}>
      <SectionTitle title={title} onPress={handleMorePress} href={ACTIVITY_SCREEN_ROUTE} mx={2} />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => (
          <SeeAllCard href={ACTIVITY_SCREEN_ROUTE} onPress={handleMorePress} />
        )}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={notifications}
        keyExtractor={(item) => item.internalID}
        renderItem={({ item, index }) => (
          <ActivityRailItem
            item={item}
            onPress={(item) => {
              const destinationRoute = matchRoute(item.targetHref)
              const destinationModule =
                destinationRoute.type === "match" ? destinationRoute?.module : ""

              trackEvent(HomeAnalytics.activityThumbnailTapEvent(index, destinationModule))
            }}
          />
        )}
      />
    </Flex>
  )
}

const notificationsConnectionFragment = graphql`
  fragment ActivityRail_viewer on Viewer @argumentDefinitions(count: { type: "Int" }) {
    notificationsConnection(first: $count) {
      edges {
        node {
          internalID
          notificationType
          artworks: artworksConnection {
            totalCount
          }
          item {
            ... on ViewingRoomPublishedNotificationItem {
              viewingRoomsConnection(first: 1) {
                totalCount
              }
            }

            ... on ArticleFeaturedArtistNotificationItem {
              article {
                internalID
              }
            }
          }
          ...ActivityRailItem_item
        }
      }
    }
  }
`
