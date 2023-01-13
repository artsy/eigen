import { act, RenderResult } from "@testing-library/react-native"
import { QueryRenderer, RelayEnvironmentProvider } from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappers, renderWithWrappersLEGACY } from "./renderWithWrappers"

interface SetupTestWrapper<T extends OperationType> {
  Component: React.ComponentType<T["response"]>
  preloaded?: boolean
  query?: GraphQLTaggedNode
  variables?: T["variables"]
}

type RenderWithRelay = RenderResult & {
  env: ReturnType<typeof createMockEnvironment>
}

/**
 * Creates a test renderer which can be used to render a variety of relay
 * query configurations.
 *
 * @example - Full Queries
 *
 * const Foo = () => {
 *   const data = useLazyLoadQuery(graphql`
 *     query FooQuery {
 *       me {
 *         name
 *       }
 *     }
 *  `)
 *
 *  return <Text>{data.me.name}</Text>
 * }
 *
 * const { renderWithRelay } = setupTestWrapper({
 *   Component: Foo
 * })
 *
 * it('works', () => {
 *   renderWithRelay({
 *     Me: () => ({ name: "name" })
 *   })
 *   expect(screen.getByText('name')).toBeTruthy()
 * })
 *
 * @example - Using fragments
 *
 * const Bar = () => {
 *   const data = useFragment(graphql`
 *     fragment Bar_me on Me {
 *       name
 *     }
 *  `)
 *
 *  return <Text>{data.name}</Text>
 * }
 *
 * const { renderWithRelay } = setupTestWrapper({
 *   Component: Bar,
 *   query: graphql`
 *     query BarTestQuery @relay_test_operation {
 *       me {
 *         ...Bar_me
 *       }
 *     }
 *   `
 * })
 *
 * it('works', () => {
 *   renderWithRelay({
 *     Me: () => ({ name: 'Mock Name' })
 *   })
 *
 *   expect(screen.getByText('name')).toEqual('Mock Name')
 * })
 */
export const setupTestWrapper = <T extends OperationType>({
  Component,
  preloaded = false,
  query,
  variables = {},
}: SetupTestWrapper<T>) => {
  const renderWithRelay = (mockResolvers: MockResolvers = {}, props: any = {}): RenderWithRelay => {
    const env = createMockEnvironment()

    const TestRenderer = () => {
      return (
        <>
          {query ? (
            <QueryRenderer<T>
              environment={env}
              variables={variables}
              query={query}
              render={({ props: relayProps, error }) => {
                if (relayProps) {
                  return <Component {...relayProps} {...props} />
                } else if (error) {
                  console.error(error)
                }
              }}
            />
          ) : (
            <RelayEnvironmentProvider environment={env}>
              <Component {...props} />
            </RelayEnvironmentProvider>
          )}
        </>
      )
    }

    const view = renderWithWrappers(<TestRenderer />)

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

// tslint:disable-next-line:class-name
interface setupTestWrapper_LEGACY<T extends OperationType> {
  Component: React.ComponentType<any>
  query: GraphQLTaggedNode
  variables?: T["variables"]
}

/**
 * @deprecated avoid using this, use setupTestWrapperTL instead.
 */
// tslint:disable-next-line:variable-name
export const setupTestWrapper_LEGACY = <T extends OperationType>({
  Component,
  query,
  variables = {},
}: setupTestWrapper_LEGACY<T>) => {
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
