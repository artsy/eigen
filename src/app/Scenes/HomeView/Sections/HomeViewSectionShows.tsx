import { ContextModule } from "@artsy/cohesion"
import { Flex, Skeleton } from "@artsy/palette-mobile"
import { HomeViewSectionShowsQuery } from "__generated__/HomeViewSectionShowsQuery.graphql"
import { HomeViewSectionShows_section$key } from "__generated__/HomeViewSectionShows_section.graphql"
import { ShowsRailContainer, ShowsRailPlaceholder } from "app/Scenes/Home/Components/ShowsRail"
import { HomeViewSectionWrapper } from "app/Scenes/HomeView/Components/HomeViewSectionWrapper"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionShowsProps {
  section: HomeViewSectionShows_section$key
}

export const HomeViewSectionShows: React.FC<HomeViewSectionShowsProps> = (props) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const section = useFragment(fragment, props.section)
  const component = section.component
  const tracking = useHomeViewTracking()

  return (
    <HomeViewSectionWrapper contextModule={section.contextModule as ContextModule}>
      <ShowsRailContainer
        title={component?.title || "Shows"}
        disableLocation={!enableShowsForYouLocation}
        onTrack={(show, index) => {
          tracking.tappedShowGroup(
            show.internalID,
            show.slug,
            section.contextModule as ContextModule,
            index
          )
        }}
      />
    </HomeViewSectionWrapper>
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
      <HomeViewSectionWrapper>
        <Flex mx={2}>
          <ShowsRailPlaceholder />
        </Flex>
      </HomeViewSectionWrapper>
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
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionShowsQuery>(homeViewSectionShowsQuery, {
    id: props.sectionID,
  })

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionShows section={data.homeView.section} />
}, HomeViewSectionShowsPlaceholder)
