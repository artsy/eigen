import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewProperties, ViewStyle } from "react-native"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import ImageView from "../../OpaqueImageView"

interface Props extends ViewProperties {
  article: {
    href: string
    author: {
      name
    }
    thumbnail_image: {
      url
    }
    thumbnail_title: string
  }
}

class Article extends React.Component<Props, {}> {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.article.href)
  }

  render() {
    const article = this.props.article
    const author =
      article.author &&
      <Text style={styles.sansSerifText}>
        {article.author.name.toUpperCase()}
      </Text>

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={styles.touchableContent}>
            <ImageView style={styles.image} imageURL={article.thumbnail_image.url} />
            <Text style={styles.serifText} numberOfLines={5}>
              {article.thumbnail_title}
            </Text>
            {author}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
  touchableContent: ViewStyle
  image: ViewStyle
  sansSerifText: TextStyle
  serifText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  // TODO: The outer wrapping view is currently only there because setting `marginRight: 20` on the Article from the
  //      Articles component isn’t working.
  container: {
    width: 320,
  },
  touchableContent: {
    width: 300,
  },
  image: {
    width: 300,
    height: 175,
  },
  sansSerifText: {
    fontSize: 10,
    textAlign: "left",
    marginTop: 5,
    fontFamily: "Avant Garde Gothic ITCW01Dm",
    color: "grey",
  },
  serifText: {
    fontFamily: "AGaramondPro-Regular",
    fontSize: 16,
    marginTop: 10,
    width: 275,
  },
})

export default createFragmentContainer(
  Article,
  graphql`
    fragment Article_article on Article {
      thumbnail_title
      href
      author {
        name
      }
      thumbnail_image {
        url(version: "large")
      }
    }
  `
)

interface RelayProps {
  article: {
    thumbnail_title: string | null
    href: string | null
    author: {
      name: string | null
    } | null
    thumbnail_image: {
      url: string | null
    } | null
  }
}
