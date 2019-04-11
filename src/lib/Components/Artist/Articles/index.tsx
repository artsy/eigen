import React, { Component } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SerifText from "../../Text/Serif"
import Article from "./Article"

import { Articles_articles } from "__generated__/Articles_articles.graphql"

interface Props {
  articles: Articles_articles
}

class Articles extends Component<Props> {
  render() {
    const articles = this.props.articles
    return (
      <View>
        <SerifText style={styles.heading}>Featured Articles</SerifText>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollsToTop={false}
          style={{ overflow: "visible", marginBottom: 40 }}
        >
          {articles.map(article => (
            <Article key={article.__id} article={article as any} style={styles.article} />
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 12,
    fontSize: 20,
  },
  article: {
    // TODO: Why doesn’t this work? Currently working around it by making the Article internal view 20pt wider.
    // marginRight: 20,
  },
})

export default createFragmentContainer(Articles, {
  articles: graphql`
    fragment Articles_articles on Article @relay(plural: true) {
      __id
      ...Article_article
    }
  `,
})
