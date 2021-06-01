import { ArticlesRail_articlesConnection } from "__generated__/ArticlesRail_articlesConnection.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-hooks"
import { ArticleCardContainer } from "./ArticleCard"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({ articlesConnection }) => {
  const articles = extractNodes(articlesConnection)

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
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => <ArticleCardContainer article={item} />}
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
          id
          ...ArticleCard_article
        }
      }
    }
  `,
})
