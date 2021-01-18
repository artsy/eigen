import React from "react"
import { requireNativeComponent, ViewProps } from "react-native"

const NativeLoadFailureView = requireNativeComponent("ARLoadFailureView")

interface Props extends ViewProps {
  // A callback that is called when the user requests a retry.
  onRetry?: () => void
}

export const LoadFailureView: React.FC<Props> = (props) => <NativeLoadFailureView {...props} />
