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

class MediumImageShow extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.show.href);
  }

  render() {
    const show = this.props.show;
    const image = show.meta_image;
    const imageURL = image && image.url;

    const window = Dimensions.get('window');
    const imageWidth = (window.width - 120) / 3;
    const imageHeight = Math.floor(imageWidth / 1.5);

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{margin: 10, width : imageWidth}}>
          <OpaqueImageView imageURL={imageURL}
                              style={{ width: imageWidth, height: imageHeight, marginBottom: 5 }} />
          <ShowMetadata style= {{ width: imageWidth }} show={this.props.show} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Relay.createContainer(MediumImageShow, {
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        href
        meta_image {
          url(version: "large")
        }
        ${ShowMetadata.getFragment('show')}
      }
    `,
  }
});