import { ContextModule } from "@artsy/cohesion"
import { ArticlesRailHomeViewSection_section$key } from "__generated__/ArticlesRailHomeViewSection_section.graphql"
import { ArticlesRailFragmentContainer } from "app/Scenes/Home/Components/ArticlesRail"
import { graphql, useFragment } from "react-relay"

interface ArticlesRailHomeViewSectionProps {
  section: ArticlesRailHomeViewSection_section$key
}

export const ArticlesRailHomeViewSection: React.FC<ArticlesRailHomeViewSectionProps> = (props) => {
  const section = useFragment(sectionFragment, props.section)

  if (!section.articlesConnection) {
    return null
  }

  return (
    <ArticlesRailFragmentContainer
      title={section.component?.title ?? ""}
      articlesConnection={section.articlesConnection}
      contextModule={section.internalID as ContextModule}
    />
  )
}

const sectionFragment = graphql`
  fragment ArticlesRailHomeViewSection_section on ArticlesRailHomeViewSection {
    internalID
    component {
      title
    }
    articlesConnection(first: 10) {
      ...ArticlesRail_articlesConnection
    }
  }
`
