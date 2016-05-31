/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../modules/switch_board';

const windowDimensions = Dimensions.get('window');
const imageWidth = windowDimensions.width > 700 ? (windowDimensions.width - 100)/2 : (windowDimensions.width - 40);

class LargeImageShow extends React.Component {
  handleTap() {
    const url = `${this.props.show.href}`;
    console.log(url);
    SwitchBoard.presentNavigationViewController(this, url);
  }

  render() {
    const show = this.props.show;
    const image = show.meta_image;
    const imageURL = image && image.cropped.url;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{margin: 10, width: this.props.relay.variables.imageWidth }}>
          <OpaqueImageView imageURL={imageURL} style={{width: this.props.relay.variables.imageWidth, height: this.props.relay.variables.imageHeight, marginBottom: 5}} />
          <ShowMetadata show={show} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

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