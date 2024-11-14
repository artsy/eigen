import { ContextModule } from "@artsy/cohesion"
import { Flex, FlexProps, Skeleton } from "@artsy/palette-mobile"
import { HomeViewSectionShowsQuery } from "__generated__/HomeViewSectionShowsQuery.graphql"
import { HomeViewSectionShows_section$key } from "__generated__/HomeViewSectionShows_section.graphql"
import { ShowsRailContainer, ShowsRailPlaceholder } from "app/Scenes/Home/Components/ShowsRail"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionShowsProps extends FlexProps {
  section: HomeViewSectionShows_section$key
  index: number
}

export const HomeViewSectionShows: React.FC<HomeViewSectionShowsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const section = useFragment(fragment, sectionProp)
  const component = section.component
  const tracking = useHomeViewTracking()

  return (
    <Flex>
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
        {...flexProps}
      />
      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
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

export const HomeViewSectionShowsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionShowsQuery>(
      homeViewSectionShowsQuery,
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

    return <HomeViewSectionShows section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionShowsPlaceholder,
  ErrorFallback: NoFallback,
})
