import { ArticlesRail_articlesConnection } from "__generated__/ArticlesRail_articlesConnection.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-hooks"
import { ArticleCardContainer } from "../../../Components/ArticleCard"
import HomeAnalytics from "../homeAnalytics"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({ articlesConnection }) => {
  const articles = extractNodes(articlesConnection)

  if (!articles.length) {
    return <></>
  }

  const tracking = useTracking()

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title="Latest from Artsy Editorial" />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          ListHeaderComponent={() => <Spacer ml="2" />}
          ListFooterComponent={() => <Spacer ml="2" />}
          data={articles}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ArticleCardContainer
              onPress={() => {
                const tapEvent = HomeAnalytics.articleThumbnailTapEvent(item.internalID, item.slug || "", index)

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

export const ArticlesRailFragmentContainer = createFragmentContainer(ArticlesRail, {
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
