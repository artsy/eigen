import Relay from 'react-relay'
import React from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'

import ImageView from '../../opaque_image_view'
import SwitchBoard from '../../../native_modules/switch_board'

class Article extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.article.href)
  }

  render() {
    const article = this.props.article
    const author = article.author && <Text style={styles.sansSerifText}>{article.author.name.toUpperCase()}</Text>

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={styles.touchableContent}>
            <ImageView style={styles.image} imageURL={article.thumbnail_image.url} />
            <Text style={styles.serifText} numberOfLines={5}>{article.thumbnail_title}</Text>
            {author}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // TODO The outer wrapping view is currently only there because setting `marginRight: 20` on the Article from the
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
    textAlign: 'left',
    marginTop: 5,
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
    color: 'grey',
  },
  serifText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginTop: 10,
    width: 275,
  }
})

export default Relay.createContainer(Article, {
  fragments: {
    article: () => Relay.QL`
      fragment on Article {
        thumbnail_title
        href
        author {
          name
        }
        thumbnail_image {
          url(version: "large")
        }
      }
    `,
  }
})
