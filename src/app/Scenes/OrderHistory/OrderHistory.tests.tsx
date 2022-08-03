import { OrderHistoryTestsQuery } from "__generated__/OrderHistoryTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import {
  resolveMostRecentRelayOperation,
  resolveMostRecentRelayOperationRawPayload,
} from "app/tests/resolveMostRecentRelayOperation"
import { OrderHistoryContainer } from "./OrderHistory"
import { OrderHistoryQueryRender } from "./OrderHistory"
import { OrderHistoryPlaceholder } from "./OrderHistory"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

describe(OrderHistoryQueryRender, () => {
  it("Loads OrderHistoryQueryRender", () => {
    const tree = renderWithWrappersLEGACY(<OrderHistoryQueryRender />)
    expect(tree.root.findAllByType(OrderHistoryPlaceholder)).toHaveLength(1)
  })
})

describe("Order history container", () => {
  const TestRenderer = () => (
    <QueryRenderer<OrderHistoryTestsQuery>
      environment={getRelayEnvironment()}
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

  it("Render empty order list", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        me: {
          orders: [],
        },
      },
    })
    expect(extractText(tree.root.findByType(FlatList))).toContain("No orders")
  })

  it("Render not empty order list", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
    expect(tree.root.findAllByType(OrderHistoryRowContainer)).toHaveLength(3)
  })
})
