import Spinner from "lib/Components/Spinner"
import React from "react"
import { Container as RelayContainer, QueryRenderer } from "react-relay"
import { renderWithPlaceholder } from "./renderWithPlaceholder"

type ReadyState = Parameters<React.ComponentProps<typeof QueryRenderer>["render"]>[0]

export const LoadingTestID = "relay-loading"

export default function<T extends RelayContainer<any>>(
  Container: T,
  initialProps: object = {}
): (readyState: ReadyState) => React.ReactElement<T> | null {
  return renderWithPlaceholder({
    Container,
    initialProps,
    renderPlaceholder: () => <Spinner testID={LoadingTestID} style={{ flex: 1 }} />,
  })
}
