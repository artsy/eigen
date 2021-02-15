import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, TouchableWithoutFeedback, View, ViewProperties } from "react-native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import fonts from "lib/data/fonts"
import { navigate } from "lib/navigation/navigate"

import { Article_article } from "__generated__/Article_article.graphql"
import { Sans, Spacer } from "palette"

interface Props extends ViewProperties {
  article: Article_article
}

class Article extends React.Component<Props> {
  handleTap() {
    navigate(this.props.article.href!)
  }

  render() {
    const article = this.props.article
    const imageURL = article.thumbnail_image && article.thumbnail_image.url
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={styles.touchableContent}>
            {!!imageURL && (
              <ImageView
                imageURL={article.thumbnail_image?.url}
                style={{
                  width: 300,
                  height: 175,
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              />
            )}
            <Spacer mb="1" />
            <Sans numberOfLines={2} ellipsizeMode="tail" size="3t" weight="medium">
              {article.thumbnail_title}
            </Sans>
            {!!article.author && (
              <Sans size="3t" color="black60">
                {article.author.name}
              </Sans>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // TODO: The outer wrapping view is currently only there because setting `marginRight: 20` on the Article from the
  //      Articles component isn’t working.
  container: {
    width: 320,
  },
  touchableContent: {
    width: 300,
  },
  sansSerifText: {
    fontSize: 10,
    textAlign: "left",
    marginTop: 5,
    fontFamily: fonts["avant-garde-regular"],
    color: "grey",
  },
  serifText: {
    fontFamily: "AGaramondPro-Regular",
    fontSize: 16,
    marginTop: 10,
    width: 275,
  },
})

export default createFragmentContainer(Article, {
  article: graphql`
    fragment Article_article on Article {
      thumbnail_title: thumbnailTitle
      href
      author {
        name
      }
      thumbnail_image: thumbnailImage {
        url(version: "large")
      }
    }
  `,
})
