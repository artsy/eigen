/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../modules/switch_board';

const windowDimensions = Dimensions.get('window');
const isPad = windowDimensions.width > 700;
const imageWidth = isPad ? (Math.max.apply(null, [windowDimensions.width, windowDimensions.height]) - 90)/2 : (windowDimensions.width - 40);

class LargeImageShow extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.show.href);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={styles.container}>
          <OpaqueImageView imageURL={this.props.show.meta_image.cropped.url} style={styles.image} />
          <ShowMetadata show={this.props.show} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    marginBottom: 5,
    resizeMode: 'contain'
  }
});

export default Relay.createContainer(LargeImageShow, {
  initialVariables: { imageWidth: Math.floor(imageWidth), imageHeight: Math.floor(imageWidth / 1.5) },

  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        href
        meta_image {
          cropped(width: $imageWidth, height: $imageHeight) {
            url
          }
        }
        ${ShowMetadata.getFragment('show')}
      }
    `,
  }
});