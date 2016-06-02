/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../modules/switch_board';

class Show extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.show.href);
  }

  render() {
    const show = this.props.show;
    const image = show.meta_image;
    const imageURL = image && image.url;

    const styles = this.props.styles;

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)} >
        <View style={styles.container}>
          <OpaqueImageView imageURL={imageURL} style={styles.image} />
          <ShowMetadata show={show} style={styles.metadata} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Relay.createContainer(Show, {
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        href
        meta_image {
          url(version: "large")
        }
        ${ShowMetadata.getFragment('show')}
      }
    `
  }
})