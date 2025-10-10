import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionActivityQuery } from "__generated__/HomeViewSectionActivityQuery.graphql"
import { HomeViewSectionActivity_section$key } from "__generated__/HomeViewSectionActivity_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { shouldDisplayNotification } from "app/Scenes/Activity/utils/shouldDisplayNotification"
import { SeeAllCard } from "app/Scenes/HomeView/Components/ActivityRail"
import {
  ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE,
  ACTIVITY_RAIL_ITEM_WIDTH,
  ActivityRailItem,
} from "app/Scenes/HomeView/Components/ActivityRailItem"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { isNewArchitectureEnabled } from "app/utils/isNewArchitectureEnabled"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo, useCallback } from "react"
import { FlatList, ListRenderItem } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionActivityProps {
  section: HomeViewSectionActivity_section$key
  index: number
}

export const HomeViewSectionActivity: React.FC<HomeViewSectionActivityProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const tracking = useHomeViewTracking()

    const section = useFragment(sectionFragment, sectionProp)
    const notifications = extractNodes(section.notificationsConnection).filter((notification) =>
      shouldDisplayNotification(notification, "rail")
    )
    const viewAll = section.component?.behaviors?.viewAll

    const renderItem: ListRenderItem<(typeof notifications)[0]> = useCallback(
      ({ item, index }) => {
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
      },
      [tracking, section.contextModule]
    )

    if (!notifications.length) {
      return null
    }

    const href = viewAll?.href || "/notifications"

    const onMorePress = () => {
      tracking.tappedActivityGroupViewAll(
        section.contextModule as ContextModule,
        (viewAll?.ownerType || OwnerType.activities) as ScreenOwnerType
      )
    }

    return (
      <Flex {...flexProps}>
        <Flex px={2}>
          <SectionTitle href={href} title={section.component?.title} onPress={onMorePress} />
        </Flex>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={
            viewAll
              ? () => (
                  <SeeAllCard buttonText={viewAll.buttonText} onPress={onMorePress} href={href} />
                )
              : undefined
          }
          disableVirtualization={!isNewArchitectureEnabled}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          data={notifications}
          initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
          keyExtractor={(item) => item.internalID}
          renderItem={renderItem}
        />

        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Flex>
    )
  }
)

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
            __typename

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
    <Flex {...flexProps} mx={2}>
      <SkeletonText variant="sm-display">Latest Activity</SkeletonText>
      <Spacer y={2} />

      <Flex flexDirection="row">
        <Join separator={<Spacer x={2} />}>
          {times(3 + randomValue * 10).map((index) => (
            <Flex key={index} flexDirection="row" alignItems="center">
              <SkeletonBox
                mr={1}
                height={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
                width={ACTIVITY_RAIL_ARTWORK_IMAGE_SIZE}
              />
              <Flex maxWidth={ACTIVITY_RAIL_ITEM_WIDTH}>
                <SkeletonBox width={140} height={15} mb={0.5} />
                <SkeletonBox width={60} height={15} mb={0.5} />
                <SkeletonBox width={100} height={15} />
              </Flex>
            </Flex>
          ))}
        </Join>
      </Flex>
    </Flex>
  )
}

export const HomeViewSectionActivityQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, refetchKey, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionActivityQuery>(
      homeViewSectionActivityQuery,
      {
        id: sectionID,
      },
      {
        fetchKey: refetchKey,
        fetchPolicy: "store-and-network",
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionActivity section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionActivityPlaceholder,
  ErrorFallback: NoFallback,
})
