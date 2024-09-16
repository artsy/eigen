import { ContextModule } from "@artsy/cohesion"
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
}> = ({ section }) => {
  const data = useFragment(viewingRoomsFragment, section)
  const tracking = useHomeViewTracking()
  const componentHref = data.component?.behaviors?.viewAll?.href

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={data.component?.title}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>
      <Suspense fallback={<ViewingRoomsRailPlaceholder />}>
        <LegacyViewingRoomsHomeRail
          onPress={(viewingRoom, index) => {
            tracking.tappedViewingRoomGroup(
              viewingRoom.internalID,
              viewingRoom.slug,
              data.contextModule as ContextModule,
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
    internalID
    contextModule
    component {
      title
      behaviors {
        viewAll {
          href
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
