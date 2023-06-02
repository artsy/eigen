import { Text } from "@artsy/palette-mobile"
import { ArticleHero_article$key } from "__generated__/ArticleHero_article.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleHeroProps {
  article: ArticleHero_article$key
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  const data = useFragment(ArticleHeroQuery, article)

  return (
    <>
      <Text>{data.title}</Text>
      <Text>{data.href}</Text>
      <Text>{data.vertical}</Text>
      <Text>{data.byline}</Text>
    </>
  )
}

const ArticleHeroQuery = graphql`
  fragment ArticleHero_article on Article {
    title
    href
    vertical
    byline
    hero {
      ... on ArticleFeatureSection {
        layout
        embed
        media
        image {
          url
          split: resized(width: 900) {
            src
            srcSet
          }
          text: cropped(width: 1600, height: 900) {
            src
            srcSet
          }
        }
      }
    }
  }
`
