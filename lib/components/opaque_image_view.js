/* @flow */
'use strict';

import React from 'react-native';

export default class OpaqueImageView extends React.Component {
  render() {
    return <NativeOpaqueImageView {...this.props} />;
  }
}

OpaqueImageView.propTypes = {
  imageURL: React.PropTypes.string,
  aspectRatio: React.PropTypes.number,
};

const NativeOpaqueImageView = React.requireNativeComponent('AROpaqueImageView', OpaqueImageView);
