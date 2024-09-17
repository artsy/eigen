import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionViewingRoomsQuery } from "__generated__/HomeViewSectionViewingRoomsQuery.graphql"
import { HomeViewSectionViewingRooms_section$key } from "__generated__/HomeViewSectionViewingRooms_section.graphql"
import { MEDIUM_CARD_HEIGHT, MEDIUM_CARD_WIDTH } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import {
  ViewingRoomsHomeRail as LegacyViewingRoomsHomeRail,
  ViewingRoomsRailPlaceholder,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomsHomeRail"
import { navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { Suspense } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

export const HomeViewSectionViewingRooms: React.FC<{
  section: HomeViewSectionViewingRooms_section$key
}> = (props) => {
  const tracking = useHomeViewTracking()
  const section = useFragment(viewingRoomsFragment, props.section)
  const viewAll = section.component?.behaviors?.viewAll

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedViewingRoomGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedViewingRoomGroupViewAll(
        section.contextModule as ContextModule,
        "homeViewSection" as ScreenOwnerType
      )

      navigate(`/home-view/sections/${section.internalID}`, {
        passProps: {
          sectionType: section.__typename,
        },
      })
    }
  }

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={section.component?.title}
          onPress={viewAll ? onSectionViewAll : undefined}
        />
      </Flex>
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
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
  }
`

const HomeViewSectionArtworksPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <SkeletonText variant="lg-display">Viewing Rooms</SkeletonText>

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
    </Skeleton>
  )
}

const homeViewSectionViewingRoomsQuery = graphql`
  query HomeViewSectionViewingRoomsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionViewingRooms_section
      }
    }
  }
`

export const HomeViewSectionViewingRoomsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionViewingRoomsQuery>(
    homeViewSectionViewingRoomsQuery,
    {
      id: props.sectionID,
    }
  )

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionViewingRooms section={data.homeView.section} />
}, HomeViewSectionArtworksPlaceholder)
