import React from "react"
import { QueryRenderer } from "react-relay"

import LoadFailureView from "lib/Components/LoadFailureView"
import { ProvidePlaceholderContext } from "./placeholders"

type ReadyState = Parameters<React.ComponentProps<typeof QueryRenderer>["render"]>[0]

type FallbackRenderer = (args: { retry: null | (() => void) }) => React.ReactElement | null

export function renderWithPlaceholder<Props>({
  Container,
  render,
  renderPlaceholder,
  renderFallback,
  initialProps = {},
}: {
  Container?: React.ComponentType<Props>
  render?: (props: Props) => React.ReactChild
  renderPlaceholder: () => React.ReactChild
  renderFallback?: FallbackRenderer
  initialProps?: object
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
          // tslint:disable-next-line:no-empty
        } catch (e) {}
        console.error("Error data", data)
      }

      if (renderFallback) {
        return renderFallback({ retry })
      } else if (retrying) {
        retrying = false
        // TODO: Even though this code path is reached, the retry button keeps spinning. iirc it _should_ disappear when
        //      `onRetry` on the instance is unset.
        //
        // This will re-use the native view first created in the renderFailure callback, which means it can
        // continue its ‘retry’ animation.
        return <LoadFailureView style={{ flex: 1 }} />
      } else {
        retrying = true
        // @ts-ignore STRICTNESS_MIGRATION
        return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
      }
    } else if (props) {
      if (render) {
        return <>{render({ ...initialProps, ...(props as any) })}</>
      } else {
        // @ts-ignore STRICTNESS_MIGRATION
        return <Container {...initialProps} {...(props as any)} />
      }
    } else {
      return <ProvidePlaceholderContext>{renderPlaceholder()}</ProvidePlaceholderContext>
    }
  }
}

// tslint:disable-next-line:variable-name
export const __renderWithPlaceholderTestUtils__ = __TEST__
  ? {
      allowFallbacksAtTestTime: false,
    }
  : undefined

if (__TEST__) {
  beforeEach(() => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = false
    }
  })
}
