import { act, screen } from "@testing-library/react-native"
import { OrderHistoryTestsQuery } from "__generated__/OrderHistoryTestsQuery.graphql"
import {
  OrderHistoryContainer,
  OrderHistoryQueryRender,
  OrderHistoryPlaceholder,
} from "app/Scenes/OrderHistory/OrderHistory"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe(OrderHistoryQueryRender, () => {
  it("Loads OrderHistoryQueryRender", async () => {
    await renderWithWrappers(<OrderHistoryQueryRender />)
    expect(screen.getAllByTestId("order-history-placeholder")).toHaveLength(1)
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
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            ordersConnection: {
              edges: [],
            },
          },
        },
      })
    })
    expect(screen.getByText("No orders")).toBeOnTheScreen()
  })

  it("Render not empty order list", async () => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ordersConnection: {
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
    expect(screen.getAllByTestId("order-container")).toHaveLength(3)
  })
})
