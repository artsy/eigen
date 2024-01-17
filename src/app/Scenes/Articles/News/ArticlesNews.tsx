import { Flex, Separator, Spacer, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { Stack } from "app/Components/Stack"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"

interface NewsArticle {
  internalID: string
  title: string
  href: string
}

export interface ArticleNewsProps {
  viewer: {
    articles: NewsArticle[]
  }
}

export const ArticlesNews: React.FC<ArticleNewsProps> = ({ viewer }) => {
  const color = useColor()
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const articles = viewer.articles.map((article, index) => (
    <Flex key={index}>
      <Touchable
        onPress={() => {
          navigate(article.href)
        }}
      >
        <Text>{article.title}</Text>
        {index !== viewer.articles.length - 1 && <Spacer y={1} />}
        {index !== viewer.articles.length - 1 && <Separator />}
      </Touchable>
    </Flex>
  ))

  return (
    <Stack spacing={2} m={2} p={2} border="1px solid" borderColor="black30">
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">News</Text>
        <Text variant="lg-display">{date}</Text>
      </Flex>
      {articles}
      <Touchable
        onPress={() => {
          navigate("/news")
        }}
      >
        <Text variant="sm-display">More in News</Text>
      </Touchable>
    </Stack>
  )
}

const ArticlesNewsFragment = graphql`
  fragment ArticlesNews_viewer on Viewer {
    articles(published: true, limit: 3, sort: PUBLISHED_AT_DESC, layout: NEWS) {
      internalID
      title
      href
    }
  }
`

export default createFragmentContainer(ArticlesNews, {
  viewer: ArticlesNewsFragment,
})
