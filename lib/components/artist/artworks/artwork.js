'use strict';

import Relay from 'react-relay';
import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import ImageView from '../../opaque_image_view';
import SerifText from '../../text/serif';
import colors from '../../../../data/colors';
import SwitchBoard from '../../../modules/switch_board';

export default class Artwork extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artwork.href);
  }

  render() {
    const artwork = this.props.artwork;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
          <ImageView style={styles.image} aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
          <SerifText style={[styles.text, styles.artist]}>{artwork.artist.name}</SerifText>
          <SerifText style={styles.text}>
            <SerifText style={[styles.text, styles.title]}>{ artwork.title }</SerifText>
            { artwork.date ? (", " + artwork.date) : "" }
          </SerifText>
          <SerifText style={styles.text}>{this.props.artwork.partner.name }</SerifText>
          { this.saleMessage() }
        </View>
      </TouchableWithoutFeedback>
    );
  }

  saleMessage() {
    const message = this.props.artwork.sale_message;
    return message ? <SerifText style={styles.text}>{ message }</SerifText> : null;
   }
};

Artwork.propTypes = {
  artwork: React.PropTypes.shape({
    title: React.PropTypes.string,
    sale_message: React.PropTypes.string,
    image: React.PropTypes.shape({
      url: React.PropTypes.string,
      aspect_ratio: React.PropTypes.number,
    }),
    artist: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
    partner: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  image: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: colors['gray-semibold'],
  },
  artist: {
    fontWeight: 'bold',
  },
  title: {
    fontStyle: 'italic',
  }
});
