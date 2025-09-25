import { Flex, Spinner } from "@artsy/palette-mobile"
import { captureException } from "@sentry/react-native"
import { FadeIn } from "app/Components/FadeIn"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ReactElement, Suspense } from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"

/**
 * A symbol used to indicate that no error fallback should be rendered.
 */
export const NoFallback = Symbol("NoFallback")

/**
 * A symbol used to indicate that the default Spinner fallback should be used.
 */
export const SpinnerFallback = Symbol("SpinnerFallback")

type WithSuspenseOptions<T> = {
  /**
   * The component to be rendered within the suspense boundary.
   */
  Component: React.FC<T extends Object ? T : any>

  /**
   * The component to display while the content is loading.
   * Pass `SpinnerFallback` to use the default loading spinner, in most cases you should use a skeleton loader instead.
   */
  LoadingFallback: React.FC<any> | typeof SpinnerFallback

  /**
   * The component to display if an error occurs.
   * Pass `NoFallback` to skip rendering any error fallback, only use this for subcomponents that don't need to render anything, e.g. a rail.
   * Make sure to test your error component and make sure nav is available to navigate away from the error.
   */
  ErrorFallback:
    | ((props: FallbackProps, componentProps: T) => ReactElement | null)
    | typeof NoFallback

  /**
   * Skip the FadeIn animation for components that manage their own opacity/animation.
   * Useful for components like BottomSheet footers that have conflicting animations.
   */
  disableFadeIn?: boolean
}

const DefaultLoadingFallback: React.FC = () => (
  <Flex testID="default-loading-feedback" flex={1} justifyContent="center" alignItems="center">
    <Spinner />
  </Flex>
)

/**
 * A higher-order component that wraps the given component in an ErrorBoundary and Suspense.
 * Allows specifying fallback components for both loading and error states.
 *
 * @param {WithSuspenseOptions} options - Configuration options for the HOC.
 * @param {React.FC<T>} options.Component - The component to render within the suspense boundary.
 * @param {React.FC<any> | typeof SpinnerFallback} options.LoadingFallback - The component to display while loading (or `SpinnerFallback` for default).
 * @param {((props: FallbackProps) => ReactElement | null) | typeof NoFallback} options.ErrorFallback - The component to display if an error occurs (or `NoFallback` to skip).
 * @returns {React.FC<any>} The wrapped component with suspense and error handling.
 */
export const withSuspense = <T extends Object | any>({
  Component,
  LoadingFallback,
  ErrorFallback,
  disableFadeIn = false,
}: WithSuspenseOptions<T>): React.FC<T> => {
  const LoadingFallbackComponent =
    LoadingFallback === SpinnerFallback ? DefaultLoadingFallback : LoadingFallback

  return (props: any) => {
    // we display the fallback component if error or we defensively hide the component
    return (
      <ErrorBoundary
        fallbackRender={(error) => {
          if (ErrorFallback === NoFallback) {
            // No fallback means render nothing when an error occurs
            return null
          }
          return ErrorFallback ? ErrorFallback(error, props) : null
        }}
        // onError captures the exception and sends it to Sentry
        onError={(error) => captureException(error)}
      >
        <Suspense
          fallback={
            <ProvidePlaceholderContext>
              <LoadingFallbackComponent {...props} />
            </ProvidePlaceholderContext>
          }
        >
          {disableFadeIn ? (
            <Component {...props} />
          ) : (
            <FadeIn style={{ flex: 1 }} slide={false}>
              <Component {...props} />
            </FadeIn>
          )}
        </Suspense>
      </ErrorBoundary>
    )
  }
}
