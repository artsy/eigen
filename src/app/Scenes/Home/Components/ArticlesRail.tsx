import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArticlesRail_articlesConnection$data } from "__generated__/ArticlesRail_articlesConnection.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { HORIZONTAL_FLATLIST_WINDOW_SIZE } from "app/Scenes/HomeView/helpers/constants"
import { INITIAL_NUMBER_TO_RENDER } from "app/Scenes/Sale/Components/SaleArtworksRail"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { memo } from "react"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection$data
  onTrack?: (article: ExtractNodeType<ArticlesRail_articlesConnection$data>, index: number) => void
  onSectionTitlePress?: () => void
  title: string
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({
  articlesConnection,
  onTrack,
  onSectionTitlePress,
  title,
}) => {
  const articles = extractNodes(articlesConnection)
  const tracking = useTracking()

  if (!articles.length) {
    return null
  }

  const onTitlePress = () => {
    if (onSectionTitlePress) {
      onSectionTitlePress()
    } else {
      tracking.trackEvent(HomeAnalytics.articlesHeaderTapEvent())
      navigate("/articles")
    }
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title={title} onPress={onTitlePress} />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={() => <Spacer x={2} />}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          initialNumToRender={isTablet() ? 10 : INITIAL_NUMBER_TO_RENDER}
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
          data={articles}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ArticleCardContainer
              onPress={() => {
                if (onTrack) {
                  return onTrack(item, index)
                }

                const tapEvent = HomeAnalytics.articleThumbnailTapEvent(
                  item.internalID,
                  item.slug || "",
                  index
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
