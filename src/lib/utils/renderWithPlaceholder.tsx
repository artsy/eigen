import React from "react"
import { QueryRenderer } from "react-relay"

import LoadFailureView from "lib/Components/LoadFailureView"
import { ProvidePlaceholderContext } from "./placeholders"

type ReadyState = Parameters<React.ComponentProps<typeof QueryRenderer>["render"]>[0]

export function renderWithPlaceholder<Props>({
  Container,
  renderPlaceholder,
  initialProps = {},
}: {
  Container: React.ComponentType<Props>
  renderPlaceholder: () => React.ReactChild
  initialProps?: object
}): (readyState: ReadyState) => React.ReactElement | null {
  let retrying = false
  return ({ error, props, retry }) => {
    if (error) {
      // In tests we want errors to clearly bubble up.
      if (typeof jest !== "undefined") {
        throw error
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

      if (retrying) {
        retrying = false
        // TODO: Even though this code path is reached, the retry button keeps spinning. iirc it _should_ disappear when
        //      `onRetry` on the instance is unset.
        //
        // This will re-use the native view first created in the renderFailure callback, which means it can
        // continue its ‘retry’ animation.
        return <LoadFailureView style={{ flex: 1 }} />
      } else {
        retrying = true
        return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
      }
    } else if (props) {
      return <Container {...initialProps} {...(props as any)} />
    } else {
      return <ProvidePlaceholderContext>{renderPlaceholder()}</ProvidePlaceholderContext>
    }
  }
}
