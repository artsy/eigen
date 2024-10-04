import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
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
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { strictWithSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionActivityProps {
  section: HomeViewSectionActivity_section$key
  index: number
}

export const HomeViewSectionActivity: React.FC<HomeViewSectionActivityProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(sectionFragment, sectionProp)
  const notifications = extractNodes(section.notificationsConnection).filter(
    shouldDisplayNotification
  )
  const viewAll = section.component?.behaviors?.viewAll

  if (!notifications.length) {
    return null
  }

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedActivityGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedActivityGroupViewAll(
        section.contextModule as ContextModule,
        OwnerType.activities
      )

      navigate("/notifications")
    }
  }

  return (
    <Flex {...flexProps}>
      <Flex px={2}>
        <SectionTitle title={section.component?.title} onPress={onSectionViewAll} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={
          viewAll
            ? () => <SeeAllCard buttonText={viewAll.buttonText} onPress={onSectionViewAll} />
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
                tracking.tappedActivityGroup(
                  item.targetHref,
                  section.contextModule as ContextModule,
                  index
                )
              }}
            />
          )
        }}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionActivity_section on HomeViewSectionActivity {
    internalID
    contextModule
    component {
      title
      behaviors {
        viewAll {
          buttonText
          href
          ownerType
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

const HomeViewSectionActivityPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()

  return (
    <Flex {...flexProps}>
      <Flex ml={2} mr={2}>
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
    </Flex>
  )
}

export const HomeViewSectionActivityQueryRenderer: React.FC<SectionSharedProps> =
  strictWithSuspense(
    ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionActivityQuery>(homeViewSectionActivityQuery, {
        id: sectionID,
      })

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionActivity section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    HomeViewSectionActivityPlaceholder,
    undefined
  )
