import { Flex, Spacer } from "@artsy/palette-mobile"
import {
  ArticlesRail_articlesConnection$data,
  ArticlesRail_articlesConnection$key,
} from "__generated__/ArticlesRail_articlesConnection.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { memo } from "react"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection$key
  onTitlePress?: () => void
  onPress?: (article: ExtractNodeType<ArticlesRail_articlesConnection$data>, index: number) => void
  title: string
  subtitle?: string
  titleHref?: string | null
}

export const ArticlesRail: React.FC<ArticlesRailProps> = memo(
  ({ onTitlePress, onPress, title, subtitle, titleHref, ...restProps }) => {
    const articlesConnection = useFragment(articlesConnectionFragment, restProps.articlesConnection)

    const articles = extractNodes(articlesConnection)

    if (!articles.length) {
      return null
    }

    return (
      <Flex>
        <SectionTitle
          href={titleHref}
          mx={2}
          onPress={onTitlePress}
          title={title}
          subtitle={subtitle}
        />

        <Flex>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => <Spacer x={2} />}
            ListFooterComponent={() => <Spacer x={2} />}
            ItemSeparatorComponent={() => <Spacer x={2} />}
            initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
            windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
            data={articles}
            keyExtractor={(item) => `${item.internalID}`}
            renderItem={({ item, index }) => (
              <ArticleCardContainer
                onPress={() => {
                  onPress?.(item, index)
                }}
                article={item}
              />
            )}
          />
        </Flex>
      </Flex>
    )
  }
)

const articlesConnectionFragment = graphql`
  fragment ArticlesRail_articlesConnection on ArticleConnection {
    edges {
      node {
        internalID
        slug
        ...ArticleCard_article
      }
    }
  }
`
