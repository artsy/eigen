import { Text } from "@artsy/palette-mobile"
import { ArticleByline_article$key } from "__generated__/ArticleByline_article.graphql"
import { Fragment } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleBylineProps {
  article: ArticleByline_article$key
}

export const ArticleByline: React.FC<ArticleBylineProps> = ({ article }) => {
  const data = useFragment(ArticleBylineQuery, article)
  return (
    <>
      <Text>{data.byline}</Text>

      {data.authors.map((author, index) => {
        return (
          <Fragment key={index}>
            <Text>{author.name}</Text>
            <Text>{author.bio}</Text>
          </Fragment>
        )
      })}
    </>
  )
}

const ArticleBylineQuery = graphql`
  fragment ArticleByline_article on Article {
    byline
    authors {
      internalID
      name
      initials
      bio
      image {
        cropped(width: 60, height: 60) {
          src
          srcSet
        }
      }
    }
  }
`
