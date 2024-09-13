import { Flex, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionActivityQuery } from "__generated__/HomeViewSectionActivityQuery.graphql"
import { HomeViewSectionActivity_section$key } from "__generated__/HomeViewSectionActivity_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/Home/Components/ActivityRail"
import {
  ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE,
  ACTIVITY_RAIL_ITEM_WIDTH,
  ActivityRailItem,
} from "app/Scenes/Home/Components/ActivityRailItem"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionActivityProps {
  section: HomeViewSectionActivity_section$key
}

export const HomeViewSectionActivity: React.FC<HomeViewSectionActivityProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

  const data = useFragment(sectionFragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  const notificationsNodes = extractNodes(data?.notificationsConnection)

  const notifications = notificationsNodes.filter(shouldDisplayNotification)

  if (!notifications.length) {
    return null
  }

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
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
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        keyExtractor={(item) => item.internalID}
        renderItem={({ item, index }) => {
          return (
            <ActivityRailItem
              item={item}
              onPress={() => {
                tracking.tappedActivityGroup(item.targetHref, data.internalID, index)
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

const homeViewSectionActivityQuery = graphql`
  query HomeViewSectionActivityQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionActivity_section
      }
    }
  }
`

const HomeViewSectionActivityPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()

  return (
    <Flex ml={2} mr={2} my={2}>
      <SkeletonText variant="lg-display">Latest Activity</SkeletonText>
      <Spacer y={2} />
      <Flex flexDirection="row">
        <Join separator={<Spacer x="15px" />}>
          {times(3 + randomValue * 10).map((index) => (
            <Flex key={index} flexDirection="row">
              <SkeletonBox
                height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
                width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              />
              <Flex ml={1} maxWidth={ACTIVITY_RAIL_ITEM_WIDTH}>
                <SkeletonText variant="xs" numberOfLines={1}>
                  6 new works by Andy Warhol
                </SkeletonText>
                <SkeletonText variant="xs" numberOfLines={1}>
                  2021-01-01
                </SkeletonText>
                <SkeletonText variant="xs" numberOfLines={1}>
                  Follow - 6 days ago
                </SkeletonText>
              </Flex>
            </Flex>
          ))}
        </Join>
      </Flex>
    </Flex>
  )
}

export const HomeViewSectionActivityQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionActivityQuery>(homeViewSectionActivityQuery, {
    id: props.sectionID,
  })

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionActivity section={data.homeView.section} />
}, HomeViewSectionActivityPlaceholder)
