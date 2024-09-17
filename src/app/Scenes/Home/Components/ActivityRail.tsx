import { Flex, Spacer, Text, useTheme } from "@artsy/palette-mobile"
import { ActivityRail_viewer$key } from "__generated__/ActivityRail_viewer.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { matchRoute } from "app/routes"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList, TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityRailProps {
  title: string
  viewer: ActivityRail_viewer$key | null
}

export const ActivityRail: React.FC<ActivityRailProps> = ({ title, viewer }) => {
  const { trackEvent } = useTracking()

  const data = useFragment(notificationsConnectionFragment, viewer)

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter(shouldDisplayNotification)

  if (notifications.length === 0) {
    return null
  }

  const handleHeaderPress = () => {
    trackEvent(HomeAnalytics.activityHeaderTapEvent())

    navigate("/notifications")
  }

  const handleMorePress = () => {
    trackEvent(HomeAnalytics.activityViewAllTapEvent())

    navigate("/notifications")
  }

  return (
    <Flex pt={2}>
      <Flex px={2}>
        <SectionTitle title={title} onPress={handleHeaderPress} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <SeeAllCard onPress={handleMorePress} />}
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

interface SeeAllCardProps {
  onPress: () => void
  buttonText?: string | null
}

export const SeeAllCard: React.FC<SeeAllCardProps> = ({ buttonText, onPress }) => {
  const { space } = useTheme()

  return (
    <Flex flex={1} px={1} mx={4} justifyContent="center">
      <TouchableOpacity
        onPress={onPress}
        hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
      >
        <Text accessibilityLabel="See All" fontWeight="bold">
          {buttonText ?? "See All"}
        </Text>
      </TouchableOpacity>
    </Flex>
  )
}
