import { Sans, Spacer } from "@artsy/palette"
import { Articles_articles } from "__generated__/Articles_articles.graphql"
import React, { Component } from "react"
import { ScrollView, View } from "react-native"
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
        <Sans size="3t" weight="medium">
          Featured articles
        </Sans>
        <Spacer mb={2} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollsToTop={false}
          style={{ overflow: "visible" }}
        >
          {articles.map(article => (
            <Article key={article.id} article={article} />
          ))}
        </ScrollView>
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
