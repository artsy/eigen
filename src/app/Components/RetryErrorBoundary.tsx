import React, { Component } from "react"
import { LoadFailureView } from "./LoadFailureView"
import { NotFoundFailureView } from "./NotFoundFailureView"

// Taken from https://relay.dev/docs/guided-tour/rendering/error-states/#when-using-uselazyloadquery
interface RetryErrorBoundaryProps {
  failureView?: React.FC<{ error: Error; retry: () => void }>
  notFoundTitle?: string
  notFoundText?: string
  notFoundBackButtonText?: string
  notFoundOnBackPress?: () => void
  children: React.ReactNode
}
interface RetryErrorBoundaryState {
  error: Error | null
}

export class RetryErrorBoundary extends Component<
  RetryErrorBoundaryProps,
  RetryErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error | null): RetryErrorBoundaryState {
    return { error }
  }

  state = { error: null }

  _retry = () => {
    this.setState({ error: null })
  }

  render() {
    const { children, failureView, notFoundTitle, notFoundText, notFoundBackButtonText } =
      this.props
    const { error } = this.state

    if (error) {
      if (failureView) {
        return failureView({ error, retry: this._retry })
      }

      const isNotFoundError = getErrorHttpStatusCodes(error).includes(404)

      if (isNotFoundError) {
        return (
          <NotFoundFailureView
            title={notFoundTitle}
            text={notFoundText}
            backButtonText={notFoundBackButtonText}
            route={getNotFoundRoute(error)}
            error={error}
          />
        )
      }

      return <LoadFailureView error={error} onRetry={this._retry} />
    }

    return children
  }
}

export const getNotFoundRoute = (error: any) => {
  return error?.res?.json?.errors?.[0]?.extensions?.path || ""
}

export const getErrorHttpStatusCodes = (error: any) => {
  return error?.res?.json?.errors?.[0]?.extensions?.httpStatusCodes || []
}
