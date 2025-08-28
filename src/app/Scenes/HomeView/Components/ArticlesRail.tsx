import { Flex } from "@artsy/palette-mobile"
import {
  ArticlesRail_articlesConnection$data,
  ArticlesRail_articlesConnection$key,
} from "__generated__/ArticlesRail_articlesConnection.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { memo } from "react"
import { ScrollView } from "react-native"
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }} // matches Spacer x={2}
        >
          {articles.map((item, index) => (
            <Flex key={item.internalID} mr={2}>
              <ArticleCardContainer
                onPress={() => {
                  onPress?.(item, index)
                }}
                article={item}
              />
            </Flex>
          ))}
        </ScrollView>
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
