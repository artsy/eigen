import { Articles_articles } from "__generated__/Articles_articles.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { Spacer } from "palette"
import React, { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  articles: Articles_articles
}

class Articles extends Component<Props> {
  render() {
    const articles = this.props.articles

    return (
      <View>
        <SectionTitle title="Featured articles" />
        <AboveTheFoldFlatList<Articles_articles[number]>
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <Spacer ml="2" />}
          scrollsToTop={false}
          style={{ overflow: "visible" }}
          initialNumToRender={2}
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCardContainer article={item} />}
        />
      </View>
    )
  }
}

export default createFragmentContainer(Articles, {
  articles: graphql`
    fragment Articles_articles on Article @relay(plural: true) {
      id
      ...ArticleCard_article
    }
  `,
})
