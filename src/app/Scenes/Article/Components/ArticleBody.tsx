import { Spacer } from "@artsy/palette-mobile"
import { ArticleBody_article$key } from "__generated__/ArticleBody_article.graphql"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { ArticleSection } from "app/Scenes/Article/Components/ArticleSection"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

// TODO: Feature articles
// import { ArticleByline } from "app/Scenes/Article/Components/ArticleByline"
// import { ArticleNewsSource } from "app/Scenes/Article/Components/ArticleNewsSource"
// import { ArticlesRail } from "app/Scenes/Home/Components/ArticlesRail"

interface ArticleBodyProps {
  article: ArticleBody_article$key
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article }) => {
  const data = useFragment(ArticleBodyQuery, article)

  return (
    <>
      <ArticleHero article={data} />

      <Spacer y={2} />

      {data.sections.map((section, index) => {
        return (
          <>
            <ArticleSection key={`section-${index}`} section={section} />
          </>
        )
      })}
    </>
  )
}

const ArticleBodyQuery = graphql`
  fragment ArticleBody_article on Article {
    ...ArticleHero_article
    ...ArticleByline_article
    ...ArticleNewsSource_article
    hero {
      __typename
    }
    seriesArticle {
      thumbnailTitle
      href
    }
    vertical
    byline
    internalID
    slug
    layout
    leadParagraph
    title
    href
    publishedAt
    sections {
      ...ArticleSection_section
    }
    postscript
    relatedArticles {
      internalID
      title
      href
      byline
      thumbnailImage {
        cropped(width: 100, height: 100) {
          src
          srcSet
        }
      }
    }
  }
`
