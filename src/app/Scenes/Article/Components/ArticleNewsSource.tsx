import { Text } from "@artsy/palette-mobile"
import { ArticleNewsSource_article$key } from "__generated__/ArticleNewsSource_article.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleNewsSourceProps {
  article: ArticleNewsSource_article$key
}

export const ArticleNewsSource: React.FC<ArticleNewsSourceProps> = ({ article }) => {
  const data = useFragment(ArticleNewsSourceQuery, article)

  if (!data.newsSource) {
    return null
  }

  return (
    <>
      <Text>{data.newsSource.title}</Text>
      <Text>{data.newsSource.url}</Text>
    </>
  )
}

const ArticleNewsSourceQuery = graphql`
  fragment ArticleNewsSource_article on Article {
    newsSource {
      title
      url
    }
  }
`
