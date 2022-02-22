import { OrderHistoryTestsQuery } from "__generated__/OrderHistoryTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OrderHistoryContainer } from "./OrderHistory"
import { OrderHistoryQueryRender } from "./OrderHistory"
import { OrderHistoryPlaceholder } from "./OrderHistory"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"
jest.unmock("react-relay")

describe(OrderHistoryQueryRender, () => {
  it("Loads OrderHistoryQueryRender", () => {
    const tree = renderWithWrappers(<OrderHistoryQueryRender />)
    expect(tree.root.findAllByType(OrderHistoryPlaceholder)).toHaveLength(1)
  })
})

describe("Order history container", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<OrderHistoryTestsQuery>
      environment={env}
      query={graphql`
        query OrderHistoryTestsQuery($count: Int!) @relay_test_operation {
          me {
            ...OrderHistory_me @arguments(count: $count)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: OrderHistoryContainer,
        renderPlaceholder: () => <OrderHistoryPlaceholder />,
      })}
      variables={{ count: 10 }}
      cacheConfig={{ force: true }}
    />
  )
  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("Render empty order list", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            orders: [],
          },
        },
      })
    })
    expect(extractText(tree.root.findByType(FlatList))).toContain("No orders")
  })

  it("Render not empty order list", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            orders: {
              edges: [
                {
                  node: {
                    code: "123456789",
                  },
                },
                {
                  node: {
                    code: "987654321",
                  },
                },
                {
                  node: {
                    code: "159482637",
                  },
                },
              ],
            },
          }),
        })
      )
    })
    expect(tree.root.findAllByType(OrderHistoryRowContainer)).toHaveLength(3)
  })
})
