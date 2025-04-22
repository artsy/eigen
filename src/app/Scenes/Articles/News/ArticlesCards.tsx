import { ActionType, ContextModule, OwnerType, TappedNewsSection } from "@artsy/cohesion"
import { Flex, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { ArticlesCards_viewer$key } from "__generated__/ArticlesCards_viewer.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export interface ArticleNewsProps {
  viewer: ArticlesCards_viewer$key
}

export const ArticlesCards: React.FC<ArticleNewsProps> = ({ viewer }) => {
  const tracking = useTracking()
  const data = useFragment(ArticlesNewsFragment, viewer)

  if (!data.articles) {
    return null
  }

  const handleArticlePress = () => {
    tracking.trackEvent(tracks.tappedNewsSection())
  }

  return (
    <Flex m={2} p={2} border="1px solid" borderColor="mono30" gap={2}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">News</Text>
        <Text variant="lg-display">{date}</Text>
      </Flex>
      {data.articles.map((article, index) => (
        <Flex key={index} gap={2}>
          <RouterLink to={article.href} onPress={handleArticlePress}>
            <Flex flexDirection="row" alignItems="center">
              <Text variant="sm-display" numberOfLines={3}>
                {article.title}
              </Text>
            </Flex>
          </RouterLink>
          {index !== data.articles.length - 1 && <Separator />}
        </Flex>
      ))}
      <Touchable
        onPress={() => navigate("/news")}
        style={{ flexDirection: "row", justifyContent: "flex-end" }}
      >
        <Text variant="sm-display">More in News</Text>
      </Touchable>
    </Flex>
  )
}

const ArticlesNewsFragment = graphql`
  fragment ArticlesCards_viewer on Viewer {
    articles(published: true, limit: 3, sort: PUBLISHED_AT_DESC, layout: NEWS) {
      internalID
      title
      href
    }
  }
`

const date = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
})

const tracks = {
  tappedNewsSection: (): TappedNewsSection => ({
    action: ActionType.tappedNewsSection,
    context_module: ContextModule.articleRail,
    context_screen_owner_type: OwnerType.home,
    context_screen_owner_id: "",
    destination_screen_owner_id: "",
    destination_screen_owner_type: OwnerType.marketNews,
  }),
}
