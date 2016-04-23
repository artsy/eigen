/* @flow */
'use strict';

import React from 'react-native';
const { ScrollView, StyleSheet, View } = React;

import colors from '../../../data/colors';
import SerifText from '../text/serif';
import ImageView from '../opaque_image_view';

export default class Articles extends React.Component {
  render() {
    const imageURL = "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FroPo-657COPh48THvWXBJQ%252Funspecified.jpg&width=340&height=200&quality=90";
    return (
      <View style={styles.container}>
        <SerifText style={styles.heading}>Featured Articles</SerifText>
        <ScrollView horizontal={true} style={{ overflow: 'visible' }}>
          <ImageView style={{ height: 200, marginRight: 20 }}
                     aspectRatio={1.7}
                     imageURL={imageURL} />
          <ImageView style={{ height: 200, marginRight: 20 }}
                     aspectRatio={1.7}
                     imageURL={imageURL} />
          <ImageView style={{ height: 200, marginRight: 0 }}
                     aspectRatio={1.7}
                     imageURL={imageURL} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors['gray-regular'],
  },
  heading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
  }
});
