import React from "react"
import { QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappers_legacy } from "./renderWithWrappers"

interface SetupTestWrapper<T extends OperationType> {
  // TODO: Component: React.ComponentType<T['response']> type errors here
  Component: React.ComponentType<any>
  query: GraphQLTaggedNode
  variables?: T["variables"]
}

export const setupTestWrapper = <T extends OperationType>({
  Component,
  query,
  variables = {},
}: SetupTestWrapper<T>) => {
  const getWrapper = (mockResolvers: MockResolvers = {}) => {
    const env = createMockEnvironment()

    const TestRenderer = () => (
      <QueryRenderer<T>
        environment={env}
        variables={variables}
        // tslint:disable-next-line: relay-operation-generics
        query={query}
        render={({ props, error }) => {
          if (props !== null) {
            return <Component {...props} />
          } else if (error !== null) {
            console.error(error)
          }
        }}
      />
    )

    const wrapper = renderWithWrappers_legacy(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })

    return wrapper
  }

  return { getWrapper }
}
