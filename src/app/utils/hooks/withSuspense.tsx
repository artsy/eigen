import { Flex, Spinner } from "@artsy/palette-mobile"
import { captureException } from "@sentry/react-native"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const withSuspense =
  (
    Component: React.FC<any>,
    Fallback: React.FC<any> = () => (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    ),
    ErrorFallback?: React.FC<any>
  ) =>
  (props: any) => {
    // we display the fallback component if error or we defensively hide the component
    const errorFallback = !!ErrorFallback ? <ErrorFallback {...props} /> : undefined
    return (
      <ErrorBoundary
        fallbackRender={() => errorFallback}
        // onError captures the exception and sends it to Sentry
        onError={(error) => captureException(error)}
      >
        <Suspense
          fallback={
            <ProvidePlaceholderContext>
              <Fallback {...props} />
            </ProvidePlaceholderContext>
          }
        >
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
