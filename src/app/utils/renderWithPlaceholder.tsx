import { LoadFailureView } from "app/Components/LoadFailureView"
import { NotFoundFailureView } from "app/Components/NotFoundFailureView"
import { getErrorHttpStatusCodes, getNotFoundRoute } from "app/Components/RetryErrorBoundary"
import { QueryRenderer } from "react-relay"
import { ProvidePlaceholderContext } from "./placeholders"

type ReadyState = Parameters<React.ComponentProps<typeof QueryRenderer>["render"]>[0]

export type FallbackRenderer = (args: {
  retry?: (() => void) | null
  error?: Error
}) => React.ReactElement | null

export function renderWithPlaceholder<Props>({
  Container,
  render,
  renderPlaceholder,
  renderFallback,
  initialProps = {},
  placeholderProps = {},
  showNotFoundView = true,
}: {
  Container?: React.ComponentType<Props>
  render?: (props: Props) => React.ReactNode
  renderPlaceholder: (props?: any) => React.ReactNode
  renderFallback?: FallbackRenderer
  initialProps?: object
  placeholderProps?: object
  showNotFoundView?: boolean
}): (readyState: ReadyState) => React.ReactElement | null {
  if (!Container && !render) {
    throw new Error("Please supply one of `render` or `Component` to renderWithPlaceholder")
  }
  if (Container && render) {
    throw new Error("Please supply only one of `render` or `Component` to renderWithPlaceholder")
  }

  let retrying = false
  return ({ error, props, retry }) => {
    if (error) {
      // In tests we want errors to clearly bubble up.
      if (typeof jest !== "undefined") {
        if (!__renderWithPlaceholderTestUtils__?.allowFallbacksAtTestTime) {
          throw error
        }
      } else {
        console.error(error)
      }

      const networkError = error as any
      if (networkError.response && networkError.response._bodyInit) {
        let data = networkError.response._bodyInit || "{}"
        try {
          data = JSON.parse(data)
        } catch (error) {
          console.log("[renderWithPlaceholder] Error parsing response JSON", error)
        }
        console.error("[renderWithPlaceholder] Error data", data)
      }

      const isNotFoundError = getErrorHttpStatusCodes(error).includes(404)

      if (isNotFoundError && showNotFoundView) {
        const route = getNotFoundRoute(error)
        return <NotFoundFailureView error={error} route={route} />
      }

      if (renderFallback) {
        return renderFallback({ retry, error })
      } else if (retrying) {
        retrying = false
        // TODO: Even though this code path is reached, the retry button keeps spinning. iirc it _should_ disappear when
        //      `onRetry` on the instance is unset.
        //
        // This will re-use the native view first created in the renderFailure callback, which means it can
        // continue its ‘retry’ animation.
        return <LoadFailureView error={error} />
      } else {
        retrying = true
        return <LoadFailureView onRetry={retry} error={error} />
      }
    } else if (props) {
      if (render) {
        return <>{render({ ...initialProps, ...(props as any) })}</>
      } else if (Container) {
        return <Container {...initialProps} {...(props as any)} />
      } else {
        return null
      }
    } else {
      return (
        <ProvidePlaceholderContext>
          {renderPlaceholder({ ...placeholderProps })}
        </ProvidePlaceholderContext>
      )
    }
  }
}

export const __renderWithPlaceholderTestUtils__ = __TEST__
  ? { allowFallbacksAtTestTime: false }
  : undefined

if (__TEST__) {
  beforeEach(() => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = false
    }
  })
}
