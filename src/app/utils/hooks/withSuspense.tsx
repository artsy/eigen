import { Flex, Spinner } from "@artsy/palette-mobile"
import { ErrorBoundary } from "@sentry/react-native"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"

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
    const FallbackComponent = ErrorFallback ?? Fallback

    return (
      <ErrorBoundary fallback={<FallbackComponent {...props} />}>
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
