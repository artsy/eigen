import { ArticlesRail_articlesConnection } from "__generated__/ArticlesRail_articlesConnection.graphql"
import Article from "lib/Components/Artist/Articles/Article"
import { SectionTitle } from "lib/Components/SectionTitle"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-hooks"

interface ArticlesRailProps {
  articlesConnection: ArticlesRail_articlesConnection
}

export const ArticlesRail: React.FC<ArticlesRailProps> = ({ articlesConnection }) => {
  const articles = extractNodes(articlesConnection)
  // const articles = articlesConnection

  console.log("ARTICLES:", articles)

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
          renderItem={({ item }) => <Article article={item} />}
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
          ...Article_article
        }
      }
    }
  `,
})
