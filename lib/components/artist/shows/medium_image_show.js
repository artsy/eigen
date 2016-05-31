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
const imageWidth = (windowDimensions.width - 120)/3;

class MediumImageShow extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.show.href);
  }

  render() {
    const show = this.props.show;
    const image = show.meta_image;
    const imageURL = image && image.cropped.url;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{margin: 10, width : imageWidth}}>
          <OpaqueImageView imageURL={imageURL} style={{width: this.props.relay.variables.imageWidth, height: this.props.relay.variables.imageHeight, marginBottom: 5}} />
          <ShowMetadata style= {{ width: this.props.relay.variables.imageWidth }} show={show} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Relay.createContainer(MediumImageShow, {
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