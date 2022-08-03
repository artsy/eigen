import { render } from "@testing-library/react-native"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { QueryRenderer } from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"

import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappersLEGACY } from "./renderWithWrappers"
import { resolveMostRecentRelayOperation } from "./resolveMostRecentRelayOperation"

interface SetupTestWrapper<T extends OperationType> {
  // TODO: Component: React.ComponentType<T['response']> type errors here
  Component: React.ComponentType<any>
  query: GraphQLTaggedNode
  variables?: T["variables"]
}

export const setupTestWrapperTL = <T extends OperationType>({
  Component,
  query,
  variables = {},
}: SetupTestWrapper<T>) => {
  const renderWithRelay = (mockResolvers: MockResolvers = {}) => {
    const TestRenderer = () => (
      <QueryRenderer<T>
        environment={getMockRelayEnvironment()}
        variables={variables}
        // tslint:disable-next-line: relay-operation-generics
        query={query}
        render={({ props, error }) => {
          if (error) {
            console.error(error)
            return null
          }
          if (props) {
            return <Component {...(props as object)} />
          }
        }}
      />
    )

    const view = render(<TestRenderer />)

    resolveMostRecentRelayOperation(mockResolvers)

    return view
  }

  return { renderWithRelay }
}

export const setupTestWrapper = <T extends OperationType>({
  Component,
  query,
  variables = {},
}: SetupTestWrapper<T>) => {
  const getWrapper = (mockResolvers: MockResolvers = {}) => {
    const TestRenderer = () => (
      <QueryRenderer<T>
        environment={getMockRelayEnvironment()}
        variables={variables}
        query={query}
        render={({ props, error }) => {
          if (error) {
            console.error(error)
            return null
          }
          if (props) {
            return <Component {...(props as object)} />
          }
        }}
      />
    )

    const wrapper = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockResolvers)

    return wrapper
  }

  return { getWrapper }
}
