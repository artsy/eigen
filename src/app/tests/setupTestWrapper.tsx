import { render } from "@testing-library/react-native"
import React from "react"
import { QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappers } from "./renderWithWrappers"

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
    const env = createMockEnvironment()

    const TestRenderer = () => (
      <QueryRenderer<T>
        environment={env}
        variables={variables}
        // tslint:disable-next-line: relay-operation-generics
        query={query}
        render={({ props, error }) => {
          if (props) {
            return <Component {...props} />
          } else if (error) {
            console.error(error)
          }
        }}
      />
    )

    const view = render(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })

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
    const env = createMockEnvironment()

    const TestRenderer = () => (
      <QueryRenderer<T>
        environment={env}
        variables={variables}
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

    const wrapper = renderWithWrappers(<TestRenderer />)

    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })

    return wrapper
  }

  return { getWrapper }
}
