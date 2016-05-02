/* @flow */
'use strict';

import React from 'react-native';
const { ScrollView, StyleSheet, View, Text } = React;

import colors from '../../../data/colors';
import SerifText from '../text/serif';
import ImageView from '../opaque_image_view';

export default class Article extends React.Component {
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