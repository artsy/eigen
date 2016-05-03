/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View, Text } = React;

import colors from '../../../data/colors';
import SerifText from '../text/serif';
import ImageView from '../opaque_image_view';

class Article extends React.Component {
  render() {
    const article = this.props.article
    return (
      <View style={{width: 340}}>
        <ImageView style={{ height: 200, marginRight: 20 }}
                     aspectRatio={1.7}
                     imageURL={article.thumbnail_image.url} />
        <SerifText style={{margin: 5}} numberOfLines={3}>{article.title}</SerifText>
        <SerifText style={{margin: 5}}>{article.author.name}</SerifText>
      </View>
    );
  }
}

export default Relay.createContainer(Article, {
  fragments: {
    article: () => Relay.QL`
      fragment on Article {
        title
        author {
          name
        }
        thumbnail_image {
          url
        }
      }
    `,
  }
})