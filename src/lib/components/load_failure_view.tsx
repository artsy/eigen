import * as PropTypes from "prop-types"
import * as React from "react"
import { requireNativeComponent } from "react-native"

export default class LoadFailureView extends React.Component<any, any> {
  static propTypes = {
    // A callback that is called when the user requests a retry.
    onRetry: PropTypes.func,
  }

  render() {
    return <NativeLoadFailureView {...this.props} />
  }
}

const NativeLoadFailureView = requireNativeComponent("ARLoadFailureView", LoadFailureView)
