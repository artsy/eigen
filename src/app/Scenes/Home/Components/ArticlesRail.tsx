import { ContextModule } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArticlesRail_articlesConnection$data } from "__generated__/ArticlesRail_articlesConnection.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { memo } from "react"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection$data
  contextModule?: ContextModule
  title: string
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({
  articlesConnection,
  contextModule,
  title,
}) => {
  const articles = extractNodes(articlesConnection)
  const tracking = useTracking()

  if (!articles.length) {
    return null
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle
          title={title}
          onPress={() => {
            tracking.trackEvent(HomeAnalytics.articlesHeaderTapEvent())
            navigate("/articles")
          }}
        />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={() => <Spacer x={2} />}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          initialNumToRender={isTablet() ? 10 : 5}
          data={articles}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ArticleCardContainer
              onPress={() => {
                const tapEvent = HomeAnalytics.articleThumbnailTapEvent(
                  item.internalID,
                  item.slug || "",
                  index,
                  contextModule
                )
                tracking.trackEvent(tapEvent)
              }}
              article={item}
            />
          )}
        />
      </Flex>
    </Flex>
  )
}

export const ArticlesRailFragmentContainer = memo(
  createFragmentContainer(ArticlesRail, {
    articlesConnection: graphql`
      fragment ArticlesRail_articlesConnection on ArticleConnection {
        edges {
          node {
            internalID
            slug
            ...ArticleCard_article
          }
        }
      }
    `,
  })
)
