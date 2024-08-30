import { ContextModule } from "@artsy/cohesion"
import { ShowsHomeViewSection_section$key } from "__generated__/ShowsHomeViewSection_section.graphql"
import { ShowsRailContainer } from "app/Scenes/Home/Components/ShowsRail"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

interface ShowsHomeViewSectionProps {
  section: ShowsHomeViewSection_section$key
}

export const ShowsHomeViewSection: React.FC<ShowsHomeViewSectionProps> = ({ section }) => {
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
  fragment ShowsHomeViewSection_section on ShowsHomeViewSection {
    internalID
    component {
      title
    }
  }
`
