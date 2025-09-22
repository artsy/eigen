import React, { Component, createContext, useContext } from "react"
import { LoadFailureView } from "./LoadFailureView"
import { NotFoundFailureView } from "./NotFoundFailureView"

// Taken from https://relay.dev/docs/guided-tour/rendering/error-states/#when-using-uselazyloadquery
export interface RetryErrorBoundaryProps {
  failureView?: (props: { error: Error; retry: () => void }) => React.ReactElement
  notFoundTitle?: string
  notFoundText?: string
  notFoundBackButtonText?: string
  notFoundOnBackPress?: () => void
  children?: React.ReactNode
  trackErrorBoundary?: boolean
  showBackButton?: boolean
  showCloseButton?: boolean
  useSafeArea?: boolean
}

interface RetryErrorBoundaryState {
  error: Error | null
  fetchKey: number
}

export class RetryErrorBoundary extends Component<
  RetryErrorBoundaryProps,
  RetryErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error | null): RetryErrorBoundaryState {
    // @ts-expect-error If we set the fetchKey here as well it will only increase once and be set to 0 again with the next error.
    return { error }
  }

  state = { error: null, fetchKey: 0 }

  _retry = () => {
    this.setState((prev) => ({
      // Clear the error
      error: null,
      // Increment and set a new fetchKey in order
      // to trigger a re-evaluation and refetching
      // of the query using useLazyLoadQuery
      fetchKey: prev.fetchKey + 1,
    }))
  }

  render() {
    const {
      children,
      failureView,
      notFoundTitle,
      notFoundText,
      notFoundBackButtonText,
      trackErrorBoundary = true,
      showBackButton = false,
      showCloseButton = false,
      useSafeArea = true,
    } = this.props
    const { error, fetchKey } = this.state

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
          showBackButton={showBackButton}
          showCloseButton={showCloseButton}
          trackErrorBoundary={trackErrorBoundary}
          useSafeArea={useSafeArea}
        />
      )
    }

    return (
      <RetryErrorBoundaryContext.Provider value={{ fetchKey }}>
        {children}
      </RetryErrorBoundaryContext.Provider>
    )
  }
}

export const AppWideErrorBoundary: React.FC<RetryErrorBoundaryProps> = ({ children, ...props }) => {
  return (
    <RetryErrorBoundary {...props} trackErrorBoundary={true}>
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

interface RetryErrorBoundaryContextProps {
  fetchKey?: number
}

const RetryErrorBoundaryContext = createContext<RetryErrorBoundaryContextProps>({})

export const useRetryErrorBoundaryContext = () => {
  return useContext(RetryErrorBoundaryContext)
}
