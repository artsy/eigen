import { Flex, Image, Separator, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { ArticlesCards_viewer$key } from "__generated__/ArticlesCards_viewer.graphql"
import { Stack } from "app/Components/Stack"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

export interface ArticleNewsProps {
  viewer: ArticlesCards_viewer$key
}

export const ArticlesCards: React.FC<ArticleNewsProps> = ({ viewer }) => {
  const data = useFragment(ArticlesNewsFragment, viewer)
  const space = useSpace()

  if (!data.articles) {
    return null
  }

  return (
    <Stack spacing={2} m={2} p={2} border="1px solid" borderColor="black30" style={{ flex: 0 }}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">News</Text>
        <Text variant="lg-display">{date}</Text>
      </Flex>
      {data.articles.map((article, index) => (
        <Flex key={index} gap={space(1)}>
          <Touchable
            onPress={() => {
              navigate(article.href ?? "")
            }}
          >
            <Flex flexDirection="row" alignItems="center" gap={space(1)}>
              <Image src={article.thumbnailImage?.url ?? ""} aspectRatio={1.0} width={60} />
              <Text variant="sm-display" numberOfLines={3} style={{ width: "75%" }}>
                {article.title}
              </Text>
            </Flex>
          </Touchable>
          {index !== data.articles.length - 1 && <Separator />}
        </Flex>
      ))}
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

const ArticlesNewsFragment = graphql`
  fragment ArticlesCards_viewer on Viewer {
    articles(published: true, limit: 3, sort: PUBLISHED_AT_DESC, layout: NEWS) {
      internalID
      title
      href
      thumbnailImage {
        url
      }
    }
  }
`

const date = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
})
