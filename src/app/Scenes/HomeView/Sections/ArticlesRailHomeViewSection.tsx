import { ContextModule } from "@artsy/cohesion"
import { ArticlesRailHomeViewSection_section$key } from "__generated__/ArticlesRailHomeViewSection_section.graphql"
import { ArticlesRailFragmentContainer } from "app/Scenes/Home/Components/ArticlesRail"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface ArticlesRailHomeViewSectionProps {
  section: ArticlesRailHomeViewSection_section$key
}

export const ArticlesRailHomeViewSection: React.FC<ArticlesRailHomeViewSectionProps> = (props) => {
  const section = useFragment(sectionFragment, props.section)

  if (!section.articlesConnection) {
    return null
  }

  const componentHref = section.component?.behaviors?.viewAll?.href

  return (
    <ArticlesRailFragmentContainer
      title={section.component?.title ?? ""}
      articlesConnection={section.articlesConnection}
      contextModule={section.internalID as ContextModule}
      onSectionTitlePress={
        componentHref
          ? () => {
              navigate(componentHref)
            }
          : undefined
      }
    />
  )
}

const sectionFragment = graphql`
  fragment ArticlesRailHomeViewSection_section on ArticlesRailHomeViewSection {
    internalID
    component {
      title
      behaviors {
        viewAll {
          href
        }
      }
    }
    articlesConnection(first: 10) {
      ...ArticlesRail_articlesConnection
    }
  }
`
