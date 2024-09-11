import { Flex, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionActivity_section$key } from "__generated__/HomeViewSectionActivity_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/Home/Components/ActivityRail"
import { ActivityRailItem } from "app/Scenes/Home/Components/ActivityRailItem"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionActivityProps {
  section: HomeViewSectionActivity_section$key
}

export const HomeViewSectionActivity: React.FC<HomeViewSectionActivityProps> = ({ section }) => {
  const { tappedActivityGroup } = useHomeViewTracking()

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
        renderItem={({ item, index }) => {
          return (
            <ActivityRailItem
              item={item}
              onPress={() => {
                tappedActivityGroup(item.targetHref, data.internalID, index)
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionActivity_section on HomeViewSectionActivity {
    internalID
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
