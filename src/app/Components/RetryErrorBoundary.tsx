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
  children?: React.ReactNode
  appWideErrorBoundary?: boolean
}
interface RetryErrorBoundaryState {
  error: Error | null
}

export class RetryErrorBoundary extends Component<
  RetryErrorBoundaryProps,
  RetryErrorBoundaryState
> {
  static defaultProps = {
    appWideErrorBoundary: false,
  }

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
        const route = getNotFoundRoute(error)
        return (
          <NotFoundFailureView
            title={notFoundTitle}
            text={notFoundText}
            backButtonText={notFoundBackButtonText}
            route={route}
            error={error}
          />
        )
      }

      return (
        <LoadFailureView
          error={error}
          onRetry={this._retry}
          appWideErrorBoundary={this.props.appWideErrorBoundary}
        />
      )
    }

    return children
  }
}

export const AppWideErrorBoundary: React.FC<RetryErrorBoundaryProps> = ({ children, ...props }) => {
  return (
    <RetryErrorBoundary {...props} appWideErrorBoundary={true}>
      {children}
    </RetryErrorBoundary>
  )
}

export const getNotFoundRoute = (error: any) => {
  if (error.message) {
    // Attempt to extract the URL from the message
    const urlMatch = error.message.match(/https?:\/\/[^\s]+/)
    if (urlMatch) {
      return urlMatch[0]
    }
  }

  // If no URL found, try to extract the path
  if (error.path) {
    return error.path
  }
  return undefined
}

export const getErrorHttpStatusCodes = (error: any) => {
  return error?.res?.json?.errors?.[0]?.extensions?.httpStatusCodes || []
}
