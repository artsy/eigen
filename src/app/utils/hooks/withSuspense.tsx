import { Flex, Spinner } from "@artsy/palette-mobile"
import { captureException } from "@sentry/react-native"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ReactElement, Suspense } from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"

export const NoFallback = Symbol("NoFallback")

interface WithSuspenseOptions {
  Component: React.FC<any>
  LoadingFallback?: React.FC<any>
  ErrorFallback: ((props: FallbackProps) => ReactElement | null) | typeof NoFallback
}

const DefaultLoadingFallback: React.FC = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Spinner />
  </Flex>
)

export const withSuspense = ({
  Component,
  LoadingFallback = DefaultLoadingFallback,
  ErrorFallback,
}: WithSuspenseOptions) => {
  return (props: any) => {
    // we display the fallback component if error or we defensively hide the component
    return (
      <ErrorBoundary
        fallbackRender={(error) => {
          if (ErrorFallback === NoFallback) {
            // No fallback means render nothing when an error occurs
            return null
          }
          return ErrorFallback ? ErrorFallback(error) : null
        }}
        // onError captures the exception and sends it to Sentry
        onError={(error) => captureException(error)}
      >
        <Suspense
          fallback={
            <ProvidePlaceholderContext>
              <LoadingFallback {...props} />
            </ProvidePlaceholderContext>
          }
        >
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
