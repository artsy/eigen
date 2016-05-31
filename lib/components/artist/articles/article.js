/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import SwitchBoard from '../../../modules/switch_board';

class Article extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.article.href);
  }

  render() {
    const article = this.props.article
    // TODO The outer wrapping view is currently only there because setting `marginRight: 20` on the Article from the
    //      Articles component isn’t working.
    return (
      <View style={{ width: 320 }}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={{ width: 300 }}>
              <ImageView style={{ width: 300, height: 175 }}
                        imageURL={article.thumbnail_image.cropped.url} />
            <Text style={styles.serifText} numberOfLines={5}>{article.thumbnail_title}</Text>
            <Text style={styles.sansSerifText}>{article.author.name.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
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
        thumbnail_title
        href
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