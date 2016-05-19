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
const imageWidth = (windowDimensions.width - 90)/3;

class MediumImageShow extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, ${this.props.show.href});
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{marginBottom: 20, width : imageWidth, marginLeft: -10}}>
          <OpaqueImageView imageURL={this.props.show.meta_image.cropped.url} style={{width: this.props.relay.variables.imageWidth, height: this.props.relay.variables.imageHeight, marginBottom: 5}} />
          <ShowMetadata style= {{ width: this.props.relay.variables.imageWidth }} show={this.props.show} />
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