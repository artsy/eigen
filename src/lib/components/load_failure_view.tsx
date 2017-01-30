import React from 'react'
import {
  requireNativeComponent,
} from 'react-native'

export default class LoadFailureView extends React.Component {
  render() {
    return <NativeLoadFailureView {...this.props} />
  }
}

LoadFailureView.propTypes = {
  /**
   * A callback that is called when the user requests a retry.
   */
  onRetry: React.PropTypes.func,
}

const NativeLoadFailureView = requireNativeComponent('ARLoadFailureView', LoadFailureView)
