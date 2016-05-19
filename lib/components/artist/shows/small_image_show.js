/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, TouchableWithoutFeedback, StyleSheet } = React;

import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './metadata'
import SwitchBoard from '../../../modules/switch_board';

class SmallImageShow extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, `${this.props.show.href}`);
  }

  render() {
    const show = this.props.show;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)} >
        <View style={styles.container}>
          <OpaqueImageView imageURL={show.meta_image.cropped.url} style={styles.image} />
          <ShowMetadata show={show} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 15
  },
});

export default Relay.createContainer(SmallImageShow, {
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        href
        meta_image {
          cropped(width: 75, height: 75) {
            url
          }
        }
        ${ShowMetadata.getFragment('show')}
      }
    `
  }
})