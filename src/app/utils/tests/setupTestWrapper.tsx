import { act, RenderResult } from "@testing-library/react-native"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { GraphQLTaggedNode, QueryRenderer } from "react-relay"
import { OperationType } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { renderWithWrappers, renderWithWrappersLEGACY, WrappersProps } from "./renderWithWrappers"

interface SetupTestWrapper<T extends OperationType, ComponentProps> {
  Component: React.ComponentType<T["response"] & ComponentProps>
  preloaded?: boolean
  query?: GraphQLTaggedNode
  variables?: T["variables"]
  wrapperProps?: WrappersProps
}

type RenderWithRelay = RenderResult & {
  env: ReturnType<typeof createMockEnvironment>
  mockResolveLastOperation: (mockResolvers: MockResolvers) => void
  mockRejectLastOperation: (error: Error) => void
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
 *   Component: () => <Suspense><Foo /></Suspense>
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
export const setupTestWrapper = <T extends OperationType, ComponentProps = {}>({
  Component,
  preloaded = false,
  query,
  variables = {},
  wrapperProps = {},
}: SetupTestWrapper<T, ComponentProps>) => {
  const renderWithRelay = (mockResolvers: MockResolvers = {}, props: any = {}): RenderWithRelay => {
    const env = getMockRelayEnvironment()

    const TestRenderer = () => {
      return query ? (
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
        <Component {...props} />
      )
    }

    const view = renderWithWrappers(<TestRenderer />, wrapperProps)

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

    const mockResolveLastOperation = (mockResolvers: MockResolvers) => {
      act(() => {
        env.mock.resolveMostRecentOperation((operation) => {
          return MockPayloadGenerator.generate(operation, mockResolvers)
        })
      })
    }

    const mockRejectLastOperation = (error: Error) => {
      act(() => {
        env.mock.rejectMostRecentOperation(error)
      })
    }

    return { ...view, env, mockResolveLastOperation, mockRejectLastOperation }
  }

  return { renderWithRelay }
}

interface setupTestWrapper_LEGACYProps<T extends OperationType> {
  Component: React.ComponentType<any>
  query: GraphQLTaggedNode
  variables?: T["variables"]
}

/**
 * @deprecated avoid using this, use setupTestWrapper instead.
 */

export const setupTestWrapper_LEGACY = <T extends OperationType>({
  Component,
  query,
  variables = {},
}: setupTestWrapper_LEGACYProps<T>) => {
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
