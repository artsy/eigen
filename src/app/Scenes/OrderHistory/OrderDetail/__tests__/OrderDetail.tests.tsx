import { screen } from "@testing-library/react-native"
import { OrderDetailTestsQuery } from "__generated__/OrderDetailTestsQuery.graphql"
import { OrderDetail } from "app/Scenes/OrderHistory/OrderDetail/OrderDetail"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetail", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailTestsQuery>({
    Component: (props: any) => <OrderDetail order={props.me.order} />,
    query: graphql`
      query OrderDetailTestsQuery @relay_test_operation {
        me {
          order(id: "order-id") {
            ...OrderDetail_order
          }
        }
      }
    `,
  })

  it("renders order details screen", () => {
    renderWithRelay({
      Order: () => ({
        internalID: "order-id",
        code: "1231231234",
        displayTexts: { title: "Great Choice!" },
      }),
    })

    expect(screen.getByText("Great Choice!")).toBeOnTheScreen()
    expect(screen.getByText("Order #1231231234")).toBeOnTheScreen()
  })

  describe("tracking", () => {
    it("tracks orderDetailsViewed event", () => {
      renderWithRelay({
        Order: () => ({
          internalID: "order-id",
          code: "1231231234",
          displayTexts: { title: "Great Choice!", messageType: "SUBMITTED_ORDER" },
        }),
      })

      expect(screen.getByText("Great Choice!")).toBeOnTheScreen()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "orderDetailsViewed",
            "context_module": "ordersDetail",
            "context_owner_id": "order-id",
            "context_owner_type": "orders-detail",
            "message_type": "SUBMITTED_ORDER",
          },
        ]
    `)
    })

    it("does not call tracking when order data is not available", () => {
      renderWithRelay({ Me: () => ({ order: null }) })

      expect(screen.queryByText(/Order #/)).not.toBeOnTheScreen()
      expect(mockTrackEvent).not.toHaveBeenCalled()
    })

    it("calls tracking with correct parameters for different message types", () => {
      renderWithRelay({
        Order: () => ({
          internalID: "order-id",
          code: "45645645678",
          displayTexts: {
            title: "Thank you for your purchase!",
            messageType: "PROCESSING_WIRE",
          },
        }),
      })

      expect(screen.getByText("Thank you for your purchase!")).toBeOnTheScreen()
      expect(screen.getByText("Order #45645645678")).toBeOnTheScreen()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "orderDetailsViewed",
            "context_module": "ordersDetail",
            "context_owner_id": "order-id",
            "context_owner_type": "orders-detail",
            "message_type": "PROCESSING_WIRE",
          },
        ]
      `)
    })
  })
})
