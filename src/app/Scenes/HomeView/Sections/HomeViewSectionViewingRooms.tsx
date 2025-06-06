import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { HomeViewSectionViewingRoomsQuery } from "__generated__/HomeViewSectionViewingRoomsQuery.graphql"
import { HomeViewSectionViewingRooms_section$key } from "__generated__/HomeViewSectionViewingRooms_section.graphql"
import { MEDIUM_CARD_HEIGHT, MEDIUM_CARD_WIDTH } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import {
  ViewingRoomsHomeRail as LegacyViewingRoomsHomeRail,
  ViewingRoomsRailPlaceholder,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomsHomeRail"
import { navigate } from "app/system/navigation/navigate"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo, Suspense } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionViewingRoomsProps extends FlexProps {
  section: HomeViewSectionViewingRooms_section$key
  index: number
}

export const HomeViewSectionViewingRooms: React.FC<HomeViewSectionViewingRoomsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()
  const section = useFragment(viewingRoomsFragment, sectionProp)
  const viewAll = section.component?.behaviors?.viewAll

  const onHeaderPress = () => {
    tracking.tappedViewingRoomGroupViewAll(
      section.contextModule as ContextModule,
      viewAll?.ownerType as ScreenOwnerType
    )
  }

  const href =
    viewAll?.href || `home-view/sections/${section.internalID}?sectionType=${section.__typename}`

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={href}
        px={2}
        title={section.component?.title}
        subtitle={section.component?.description}
        onPress={onHeaderPress}
      />

      <Suspense fallback={<ViewingRoomsRailPlaceholder />}>
        <LegacyViewingRoomsHomeRail
          onPress={(viewingRoom, index) => {
            tracking.tappedViewingRoomGroup(
              viewingRoom.internalID,
              viewingRoom.slug,
              section.contextModule as ContextModule,
              index
            )

            navigate(`/viewing-room/${viewingRoom.slug}`)
          }}
        />
        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Suspense>
    </Flex>
  )
}

const viewingRoomsFragment = graphql`
  fragment HomeViewSectionViewingRooms_section on HomeViewSectionViewingRooms {
    __typename
    internalID
    contextModule
    component {
      title
      description
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    ownerType
  }
`

const HomeViewSectionArtworksPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Viewing Rooms</SkeletonText>

          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(2 + randomValue * 10).map((index) => (
                <Flex key={index}>
                  <SkeletonBox height={MEDIUM_CARD_HEIGHT} width={MEDIUM_CARD_WIDTH} />
                </Flex>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionViewingRoomsQuery = graphql`
  query HomeViewSectionViewingRoomsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionViewingRooms_section
      }
    }
  }
`

export const HomeViewSectionViewingRoomsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionViewingRoomsQuery>(
        homeViewSectionViewingRoomsQuery,
        {
          id: sectionID,
        },
        {
          networkCacheConfig: {
            force: false,
          },
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionViewingRooms section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    LoadingFallback: HomeViewSectionArtworksPlaceholder,
    ErrorFallback: NoFallback,
  })
)
