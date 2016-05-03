/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View } = React;

import colors from '../../../data/colors';
import SerifText from '../text/serif';
import ImageView from '../opaque_image_view';
import Article from './article';

class Articles extends React.Component {
  render() {
    const imageURL = "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FroPo-657COPh48THvWXBJQ%252Funspecified.jpg&width=340&height=200&quality=90";
    const articles = this.props.artist.articles
    return (
      <View style={styles.container}>
        <SerifText style={styles.heading}>Featured Articles</SerifText>
        <ScrollView horizontal={true} style={{ overflow: 'visible' }}>
          <Article article={articles[0]} />
          <Article article={articles[1]} />
          <Article article={articles[2]} />
          <Article article={articles[3]} />
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

export default Relay.createContainer(Articles, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        name
        articles {
          ${Article.getFragment('article')}
        }
      }
    `,
  }
});
