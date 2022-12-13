import { act, render, RenderResult } from "@testing-library/react-native"
import { QueryRenderer, RelayEnvironmentProvider } from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator, RelayMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappersLEGACY } from "./renderWithWrappers"

interface SetupTestWrapper<T extends OperationType> {
  // TODO: Component: React.ComponentType<T['response']> type errors here
  Component: React.ComponentType<any>
  preloaded?: boolean
  query: GraphQLTaggedNode
  variables?: T["variables"]
}

type RenderWithRelay = RenderResult & { env: RelayMockEnvironment }

export const setupTestWrapperTL = <T extends OperationType>({
  Component,
  preloaded = false,
  query,
  variables = {},
}: SetupTestWrapper<T>) => {
  const renderWithRelay = (mockResolvers: MockResolvers = {}): RenderWithRelay => {
    const env = createMockEnvironment()
    const TestRenderer = () => {
      return (
        <>
          {query ? (
            <QueryRenderer<T>
              environment={env}
              variables={variables}
              query={query}
              render={({ props, error }) => {
                if (props) {
                  // @ts-ignore
                  return <Component {...props} />
                } else if (error) {
                  console.error(error)
                }
              }}
            />
          ) : (
            <RelayEnvironmentProvider environment={env}>
              <Component />
            </RelayEnvironmentProvider>
          )}
        </>
      )
    }

    const view = render(<TestRenderer />)

    act(() => {
      const resolve = preloaded
        ? env.mock.queueOperationResolver
        : env.mock.resolveMostRecentOperation

      if (preloaded) {
        if (!query) {
          throw new Error("A `query` is required when using `preloaded` prop.")
        }
        env.mock.queuePendingOperation(query, variables)
      }

      resolve((operation: any) => {
        return MockPayloadGenerator.generate(operation, mockResolvers)
      })
    })

    return { ...view, env }
  }

  return { renderWithRelay }
}

/**
 * @deprecated avoid using this, use setupTestWrapperTL instead.
 */
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

    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })

    return wrapper
  }

  return { getWrapper }
}
