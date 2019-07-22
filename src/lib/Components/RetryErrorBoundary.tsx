import React from "react"
import LoadFailureView from "./LoadFailureView"

enum ErrorState {
  Okay,
  Error,
}

interface Props {
  render: () => React.ReactNode
}

interface State {
  errorState: ErrorState
}
export class RetryErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error) {
    console.log("[RetryErrorBoundary] Caught error: ", error)
    return { errorState: ErrorState.Error }
  }

  state = {
    errorState: ErrorState.Okay,
  }

  render() {
    const { render } = this.props
    const containers = {
      [ErrorState.Okay]: render,
      [ErrorState.Error]: () => (
        <LoadFailureView style={{ flex: 1 }} onRetry={() => this.setState({ errorState: ErrorState.Okay })} />
      ),
    }
    return containers[this.state.errorState]()
  }
}
