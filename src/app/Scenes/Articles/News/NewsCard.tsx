import { Flex, Image, Separator, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { Stack } from "app/Components/Stack"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"

interface NewsCardArticle {
  internalID: string
  title: string
  href: string
  thumbnailImage: {
    url: string
  }
}

export interface NewsCardProps {
  viewer: {
    articles: NewsCardArticle[]
  }
}

export const NewsCard: React.FC<NewsCardProps> = ({ viewer }) => {
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
        <Flex flexDirection="row" alignItems="center">
          <Image src={article.thumbnailImage.url} aspectRatio={1.0} width={60} />
          <Spacer x={1} />
          <Text variant="sm-display" numberOfLines={3} style={{ width: "75%" }}>
            {article.title}
          </Text>
        </Flex>
        {index !== viewer.articles.length - 1 && <Spacer y={1} />}
        {index !== viewer.articles.length - 1 && <Separator />}
      </Touchable>
    </Flex>
  ))

  return (
    <Stack spacing={2} m={2} p={2} border="1px solid" borderColor="black30" style={{ flex: 0 }}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">News</Text>
        <Text variant="lg-display">{date}</Text>
      </Flex>
      {articles}
      <Touchable
        onPress={() => {
          navigate("/news")
        }}
        style={{ flexDirection: "row", justifyContent: "flex-end" }}
      >
        <Text variant="sm-display">More in News</Text>
      </Touchable>
    </Stack>
  )
}

const NewsCardFragment = graphql`
  fragment NewsCard_viewer on Viewer {
    articles(published: true, limit: 3, sort: PUBLISHED_AT_DESC, layout: NEWS) {
      internalID
      title
      thumbnailImage {
        url(version: "square")
      }
      href
    }
  }
`

export default createFragmentContainer(NewsCard, {
  viewer: NewsCardFragment,
})
