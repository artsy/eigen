import * as PropTypes from "prop-types"
import React from "react"
import { requireNativeComponent, ViewProperties } from "react-native"

interface Props extends ViewProperties {
  // A callback that is called when the user requests a retry.
  onRetry?: () => void
}

export default class LoadFailureView extends React.Component<Props, any> {
  static propTypes = {
    onRetry: PropTypes.func,
  }

  render() {
    // TypeScript uses the propTypes above to
    // generate an interface for NativeLoadFailureView
    // via the above propTypes. However, onRetry above is
    // classed as nullable, but the generated interface
    // doesn't take the nullability into account.
    const anyProps = this.props as any
    return <NativeLoadFailureView {...anyProps} />
  }
}

const NativeLoadFailureView = requireNativeComponent("ARLoadFailureView")
