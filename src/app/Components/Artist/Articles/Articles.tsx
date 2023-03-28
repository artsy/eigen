import { Spacer } from "@artsy/palette-mobile"
import { Articles_articles$data } from "__generated__/Articles_articles.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  articles: Articles_articles$data
}

class Articles extends Component<Props> {
  render() {
    const articles = this.props.articles

    return (
      <View>
        <SectionTitle title="Featured articles" />
        <AboveTheFoldFlatList<Articles_articles$data[number]>
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <Spacer x={2} />}
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
