import { ContextModule } from "@artsy/cohesion"
import { Flex, FlexProps, Skeleton } from "@artsy/palette-mobile"
import { HomeViewSectionShowsQuery } from "__generated__/HomeViewSectionShowsQuery.graphql"
import { HomeViewSectionShows_section$key } from "__generated__/HomeViewSectionShows_section.graphql"
import { ShowsRailContainer, ShowsRailPlaceholder } from "app/Scenes/Home/Components/ShowsRail"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionShowsProps {
  section: HomeViewSectionShows_section$key
}

export const HomeViewSectionShows: React.FC<HomeViewSectionShowsProps> = ({
  section: sectionProp,
  ...flexProps
}) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const section = useFragment(fragment, sectionProp)
  const component = section.component
  const tracking = useHomeViewTracking()

  return (
    <Flex {...flexProps}>
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

const HomeViewSectionShowsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <ShowsRailPlaceholder />
        </Flex>
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

interface HomeViewSectionShowsQueryRendererProps extends FlexProps {
  sectionID: string
}

export const HomeViewSectionShowsQueryRenderer: React.FC<HomeViewSectionShowsQueryRendererProps> =
  withSuspense(({ sectionID, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionShowsQuery>(homeViewSectionShowsQuery, {
      id: sectionID,
    })

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionShows section={data.homeView.section} {...flexProps} />
  }, HomeViewSectionShowsPlaceholder)
