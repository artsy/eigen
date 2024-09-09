import { Flex, Spacer } from "@artsy/palette-mobile"
import { ActivityRailHomeViewSection_section$key } from "__generated__/ActivityRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/Home/Components/ActivityRail"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ActivityRailHomeViewSectionProps {
  section: ActivityRailHomeViewSection_section$key
}

export const ActivityRailHomeViewSection: React.FC<ActivityRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(sectionFragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

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
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={
          componentHref
            ? () => (
                <SeeAllCard
                  onPress={() => {
                    navigate(componentHref)
                  }}
                />
              )
            : undefined
        }
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={notifications}
        initialNumToRender={3}
        keyExtractor={(item) => item.internalID}
        renderItem={({ item }) => {
          return <ActivityRailItem item={item} />
        }}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment ActivityRailHomeViewSection_section on ActivityRailHomeViewSection {
    component {
      title
      behaviors {
        viewAll {
          href
        }
      }
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
