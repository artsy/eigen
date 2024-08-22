import { Flex, Spacer } from "@artsy/palette-mobile"
import { ActivityRailHomeViewSection_section$key } from "__generated__/ActivityRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/Home/Components/ActivityRail"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"

interface ActivityRailHomeViewSectionProps {
  section: ActivityRailHomeViewSection_section$key
}

export const ActivityRailHomeViewSection: React.FC<ActivityRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(sectionFragment, section)
  const component = data.component
  const componentHref = "/notifications" // TODO: this should be in the schema

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter(shouldDisplayNotification)

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
        keyExtractor={(item) => item.internalID}
        renderItem={({ item }) => <ActivityRailItem item={item} />}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment ActivityRailHomeViewSection_section on ActivityRailHomeViewSection {
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
