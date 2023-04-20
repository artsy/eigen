import { ArticleBody_article$key } from "__generated__/ArticleBody_article.graphql"
import { ArticleByline } from "app/Scenes/Article/Components/ArticleByline"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { ArticleNewsSource } from "app/Scenes/Article/Components/ArticleNewsSource"
import { ArticleSection } from "app/Scenes/Article/Components/ArticleSection"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleBodyProps {
  article: ArticleBody_article$key
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article }) => {
  const articleData = useFragment(ArticleBodyQuery, article)

  return (
    <>
      <ArticleHero article={articleData} />
      <ArticleByline article={articleData} />
      <ArticleNewsSource article={articleData} />

      {articleData.sections.map((section, index) => {
        return (
          <>
            <ArticleSection key={index} section={section} />
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
