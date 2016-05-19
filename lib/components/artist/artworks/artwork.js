'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { Text, View, StyleSheet, TouchableWithoutFeedback } = React;

import ImageView from '../../opaque_image_view';
import SerifText from '../../text/serif';
import colors from '../../../../data/colors';
import SwitchBoard from '../../../modules/switch_board';

export default class Artwork extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, ${this.props.artwork.href});
  }

  render() {
    const artwork = this.props.artwork;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
            <ImageView style={styles.image} aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
          <SerifText style={[styles.text, styles.artist]}>{artwork.artist.name}</SerifText>
          <SerifText style={styles.text}>
            <SerifText style={[styles.text, styles.title]}>{artwork.title}</SerifText>, {artwork.date}
          </SerifText>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

Artwork.propTypes = {
  artwork: React.PropTypes.shape({
    title: React.PropTypes.string,
    image: React.PropTypes.shape({
      url: React.PropTypes.string,
      aspect_ratio: React.PropTypes.number,
    }),
    artist: React.PropTypes.shape({
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
