import { ContextModule } from "@artsy/cohesion"
import { Flex, Skeleton } from "@artsy/palette-mobile"
import { HomeViewSectionShowsQuery } from "__generated__/HomeViewSectionShowsQuery.graphql"
import { HomeViewSectionShows_section$key } from "__generated__/HomeViewSectionShows_section.graphql"
import { ShowsRailContainer, ShowsRailPlaceholder } from "app/Scenes/Home/Components/ShowsRail"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionShowsProps {
  section: HomeViewSectionShows_section$key
}

export const HomeViewSectionShows: React.FC<HomeViewSectionShowsProps> = ({ section }) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const data = useFragment(fragment, section)
  const component = data.component
  const tracking = useHomeViewTracking()

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <ShowsRailContainer
        title={component?.title || "Shows"}
        disableLocation={!enableShowsForYouLocation}
        onTrack={(show, index) => {
          tracking.tappedShowGroup(
            show.internalID,
            show.slug,
            data.contextModule as ContextModule,
            index
          )
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionShows_section on HomeViewSectionShows {
    __typename
    internalID
    contextModule
    component {
      title
    }
  }
`

const HomeViewSectionShowsPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <ShowsRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionShowsQuery = graphql`
  query HomeViewSectionShowsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionShows_section
      }
    }
  }
`

export const HomeViewSectionShowsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense(
  (props) => {
    const data = useLazyLoadQuery<HomeViewSectionShowsQuery>(homeViewSectionShowsQuery, {
      id: props.sectionID,
    })

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionShows section={data.homeView.section} />
  },
  HomeViewSectionShowsPlaceholder,
  undefined
)
