import { ContextModule } from "@artsy/cohesion"
import { ShowsRailHomeViewSection_section$key } from "__generated__/ShowsRailHomeViewSection_section.graphql"
import { ShowsRailContainer } from "app/Scenes/Home/Components/ShowsRail"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

interface ShowsRailHomeViewSectionProps {
  section: ShowsRailHomeViewSection_section$key
}

export const ShowsRailHomeViewSection: React.FC<ShowsRailHomeViewSectionProps> = ({ section }) => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")
  const data = useFragment(fragment, section)
  const component = data.component

  return (
    <ShowsRailContainer
      title={component?.title || "Shows"}
      disableLocation={!enableShowsForYouLocation}
      contextModule={data.internalID as ContextModule}
    />
  )
}

const fragment = graphql`
  fragment ShowsRailHomeViewSection_section on ShowsRailHomeViewSection {
    internalID
    component {
      title
    }
  }
`
