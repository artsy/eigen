/* @flow */
'use strict';

import React from 'react-native';

export default class OpaqueImageView extends React.Component {
  render() {
    return <NativeOpaqueImageView {...this.props} />;
  }
}

OpaqueImageView.propTypes = {
  /**
   * The URL from where to fetch the image.
   */
  imageURL: React.PropTypes.string.isRequired,

  /**
   * An aspect ratio created with: width / height.
   */
  aspectRatio: React.PropTypes.number,

  /**
   * A callback that is called once the image is loaded.
   */
  onLoad: React.PropTypes.func,
};

const NativeOpaqueImageView = React.requireNativeComponent('AROpaqueImageView', OpaqueImageView);
