import { HomeViewSectionShows_section$key } from "__generated__/HomeViewSectionShows_section.graphql"
import { ShowsRailContainer } from "app/Scenes/Home/Components/ShowsRail"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionShowsProps {
  section: HomeViewSectionShows_section$key
}

export const HomeViewSectionShows: React.FC<HomeViewSectionShowsProps> = ({ section }) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const data = useFragment(fragment, section)
  const component = data.component
  const tracking = useHomeViewTracking()

  return (
    <ShowsRailContainer
      title={component?.title || "Shows"}
      disableLocation={!enableShowsForYouLocation}
      onTrack={(show, index) => {
        tracking.tappedShowGroup(show.internalID, show.slug, data.internalID, index)
      }}
    />
  )
}

const fragment = graphql`
  fragment HomeViewSectionShows_section on HomeViewSectionShows {
    internalID
    component {
      title
    }
  }
`
