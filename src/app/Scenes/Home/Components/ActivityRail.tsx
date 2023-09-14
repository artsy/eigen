import { ContextModule, OwnerType, tappedEntityGroup } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { ActivityRail_notificationsConnection$key } from "__generated__/ActivityRail_notificationsConnection.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { isArtworksBasedNotification } from "app/Scenes/Activity/utils/isArtworksBasedNotification"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityRailProps {
  title: string
  notificationsConnection: ActivityRail_notificationsConnection$key | null
}

export const ActivityRail: React.FC<ActivityRailProps> = ({ title, notificationsConnection }) => {
  const { trackEvent } = useTracking()

  const data = useFragment(notificationsConnectionFragment, notificationsConnection)

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter((notification) => {
    if (isArtworksBasedNotification(notification.notificationType)) {
      const artworksCount = notification.artworks?.totalCount ?? 0
      return artworksCount > 0
    }

    return true
  })

  if (notifications.length === 0) {
    return null
  }

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle
          fontWeight="bold"
          title={title}
          onPress={() => {
            trackEvent(tracks.tappedHeader())
            navigate("/activity")
          }}
        />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <Spacer x={2} />}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={notifications}
        keyExtractor={(item) => `${item.internalID}`}
        renderItem={({ item, index }) => <ActivityRailItem item={item} />}
      />
    </Flex>
  )
}

const notificationsConnectionFragment = graphql`
  fragment ActivityRail_notificationsConnection on Viewer
  @refetchable(queryName: "ActivityRail_notificationsConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }) {
    notificationsConnection(first: $count) {
      edges {
        node {
          internalID
          notificationType
          artworks: artworksConnection {
            totalCount
          }
          ...ActivityRailItem_item
        }
      }
    }
  }
`

const tracks = {
  tappedHeader: () =>
    tappedEntityGroup({
      contextModule: ContextModule.activityRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.activities,
      type: "header",
    }),
  tappedThumbnail: () =>
    tappedEntityGroup({
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerId: articleID,
      destinationScreenOwnerSlug: articleSlug,
      destinationScreenOwnerType: OwnerType.article,
      contextModule: ContextModule.articleRail,
      horizontalSlidePosition: index,
      type: "thumbnail",
    }),
}
