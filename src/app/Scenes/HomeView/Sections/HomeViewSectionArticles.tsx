import { Flex } from "@artsy/palette-mobile"
import { HomeViewSectionArticles_section$key } from "__generated__/HomeViewSectionArticles_section.graphql"
import { ArticlesRailFragmentContainer } from "app/Scenes/Home/Components/ArticlesRail"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionArticlesProps {
  section: HomeViewSectionArticles_section$key
}

export const HomeViewSectionArticles: React.FC<HomeViewSectionArticlesProps> = (props) => {
  const section = useFragment(sectionFragment, props.section)
  const tracking = useHomeViewTracking()

  if (!section.articlesConnection) {
    return null
  }

  const componentHref = section.component?.behaviors?.viewAll?.href

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <ArticlesRailFragmentContainer
        title={section.component?.title ?? ""}
        articlesConnection={section.articlesConnection}
        onTrack={(article, index) => {
          tracking.tappedArticleGroup(article.internalID, article.slug, section.internalID, index)
        }}
        onSectionTitlePress={
          componentHref
            ? () => {
                navigate(componentHref)
              }
            : undefined
        }
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionArticles_section on HomeViewSectionArticles {
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
