/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View, Text } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';

class Article extends React.Component {
  render() {
    const article = this.props.article
    // TODO The outer wrapping view is currently only there because setting `marginRight: 20` on the Article from the
    //      Articles component isn’t working.
    return (
      <View style={{ width: 320 }}>
        <View style={{ width: 300 }}>
          <ImageView style={{ width: 300, height: 175 }}
                    imageURL={article.thumbnail_image.cropped.url} />
          <Text style={styles.serifText} numberOfLines={5}>{article.title}</Text>
          <Text style={styles.sansSerifText}>{article.author.name.toUpperCase()}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sansSerifText: {
    fontSize: 10,
    textAlign: 'left',
    marginTop: 5,
    fontFamily: "Avant Garde Gothic ITCW01Dm",
    color: 'grey',
  },
  serifText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginTop: 10,
    width: 275,
  }
});

export default Relay.createContainer(Article, {
  fragments: {
    article: () => Relay.QL`
      fragment on Article {
        title
        author {
          name
        }
        thumbnail_image {
          cropped(width: 300, height: 175) {
            url
          }

        }
      }
    `,
  }
})