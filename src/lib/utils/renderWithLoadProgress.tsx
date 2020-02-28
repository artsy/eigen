import Spinner from "lib/Components/Spinner"
import React from "react"
import { QueryRenderer } from "react-relay"
import { renderWithPlaceholder } from "./renderWithPlaceholder"

type ReadyState = Parameters<React.ComponentProps<typeof QueryRenderer>["render"]>[0]

export const LoadingTestID = "relay-loading"

export default function<Props>(
  Container: React.ComponentType<Props>,
  initialProps: object = {}
): (readyState: ReadyState) => React.ReactElement | null {
  return renderWithPlaceholder({
    Container,
    initialProps,
    renderPlaceholder: () => <Spinner testID={LoadingTestID} style={{ flex: 1 }} />,
  })
}
