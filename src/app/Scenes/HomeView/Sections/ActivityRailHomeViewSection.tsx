import { ContextModule } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { ActivityRailHomeViewSection_section$key } from "__generated__/ActivityRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/Home/Components/ActivityRail"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { matchRoute } from "app/routes"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ActivityRailHomeViewSectionProps {
  section: ActivityRailHomeViewSection_section$key
}

export const ActivityRailHomeViewSection: React.FC<ActivityRailHomeViewSectionProps> = ({
  section,
}) => {
  const tracking = useTracking()

  const data = useFragment(sectionFragment, section)
  const component = data.component
  const componentHref = "/notifications" // TODO: this should be in the schema

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter(shouldDisplayNotification)

  if (!notifications.length) {
    return null
  }

  return (
    <Flex pt={2}>
      <Flex px={2}>
        <SectionTitle
          title={component?.title || "Activity"}
          onPress={() => {
            navigate(componentHref)
          }}
        />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => (
          <SeeAllCard
            onPress={() => {
              navigate(componentHref)
            }}
          />
        )}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={notifications}
        initialNumToRender={3}
        keyExtractor={(item) => item.internalID}
        renderItem={({ item, index }) => {
          return (
            <ActivityRailItem
              item={item}
              onPress={() => {
                const destinationRoute = matchRoute(item.targetHref)
                const destinationModule =
                  destinationRoute.type === "match" ? destinationRoute?.module : ""

                tracking.trackEvent(
                  HomeAnalytics.activityThumbnailTapEvent(
                    index,
                    destinationModule,
                    data.internalID as ContextModule
                  )
                )
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment ActivityRailHomeViewSection_section on ActivityRailHomeViewSection {
    internalID
    component {
      title
    }
    notificationsConnection(first: 10) {
      edges {
        node {
          internalID
          notificationType
          artworks: artworksConnection {
            totalCount
          }
          targetHref
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
