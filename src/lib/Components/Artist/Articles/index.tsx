import { Articles_articles } from "__generated__/Articles_articles.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { SectionTitle } from "lib/Components/SectionTitle"
import React, { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import Article from "./Article"

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
          scrollsToTop={false}
          style={{ overflow: "visible" }}
          initialNumToRender={2}
          data={articles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Article article={item} />}
        />
      </View>
    )
  }
}

export default createFragmentContainer(Articles, {
  articles: graphql`
    fragment Articles_articles on Article @relay(plural: true) {
      id
      ...Article_article
    }
  `,
})
