import { fireEvent, screen } from "@testing-library/react-native"
import { OrderHistoryRowTestsQuery } from "__generated__/OrderHistoryRowTestsQuery.graphql"
import { OrderHistoryRowContainer } from "app/Scenes/OrderHistory/OrderHistoryRow"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockOrder = {
  internalID: "d1105415-4a55-4c3b-b71d-bfae06ec92df",
  displayState: "SUBMITTED",
  buyerTotal: "11,200",
  createdAt: "2021-05-18T14:45:20+03:00",
  itemsTotal: "€11,000",
  lineItems: {
    edges: [
      {
        node: {
          shipment: null,
          artwork: {
            image: {
              resized: {
                url: "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=55&height=44&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Ft06Xa3hKNRbLcO2t6MWOyQ%2Flarge.jpg",
              },
            },
            partner: { name: "Andrea Festa Fine Art" },
            title: "NUDIST NO. 5",
            artistNames: "Torbjørn Rødland",
          },
          fulfillments: { edges: [{ node: { trackingId: "123456789" } }] },
        },
      },
    ],
  },
}

describe("OrderHistoryRow", () => {
  const { renderWithRelay } = setupTestWrapper<OrderHistoryRowTestsQuery>({
    Component: (props) => {
      return <OrderHistoryRowContainer order={props.commerceOrder} />
    },
    query: graphql`
      query OrderHistoryRowTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...OrderHistoryRow_order
        }
      }
    `,
  })

  it("displays the artist name", () => {
    renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(screen.getByText("Torbjørn Rødland")).toBeOnTheScreen()
  })

  it("displays the partner name", () => {
    renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(screen.getByText("Andrea Festa Fine Art")).toBeOnTheScreen()
  })

  it("displays the order creation date", () => {
    renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(screen.getByText("5/18/2021")).toBeOnTheScreen()
  })

  it("displays the price", () => {
    renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(screen.getByText("11,200")).toBeOnTheScreen()
  })

  it("displays the display state", () => {
    renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(screen.getByText("pending")).toBeOnTheScreen()
  })

  describe("artwork image", () => {
    it("displays the image", () => {
      renderWithRelay({ CommerceOrder: () => mockOrder })

      expect(screen.getByTestId("image")).toBeOnTheScreen()
    })

    it("displays a gray box unless there is an image", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  artwork: {
                    ...mockOrder.lineItems.edges[0].node.artwork,
                    image: null,
                  },
                  artworkVersion: {
                    image: null,
                  },
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByTestId("image-box")).toBeOnTheScreen()
    })
  })

  describe("track package button", () => {
    it("is visible when a tracking URL is provided", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { trackingUrl: "https://tracking.com", trackingNumber: null },
                  fulfillments: { edges: [{ node: { trackingId: null } }] },
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByTestId("track-package-button")).toBeOnTheScreen()
    })

    it("is visible when a tracking number is provided", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { trackingUrl: null, trackingNumber: "12345" },
                  fulfillments: { edges: [{ node: { trackingId: null } }] },
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByTestId("track-package-button")).toBeOnTheScreen()
    })

    it("is visible when a tracking ID is provided", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { trackingUrl: null, trackingNumber: null },
                  fulfillments: { edges: [{ node: { trackingId: "tracking-id" } }] },
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByTestId("track-package-button")).toBeOnTheScreen()
    })

    it("is not visible unless tracking information is provided", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { trackingUrl: null, trackingNumber: null },
                  fulfillments: { edges: [{ node: { trackingId: null } }] },
                },
              },
            ],
          },
        }),
      })

      expect(screen.queryByTestId("track-package-button")).not.toBeOnTheScreen()
    })
  })

  describe("update payment method button", () => {
    it("includes a message and button go fix payment when the displayState is PAYMENT_FAILED", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "PAYMENT_FAILED",
        }),
      })

      screen.getByText("payment failed")

      const button = screen.getByTestId("update-payment-button")
      expect(button).toBeOnTheScreen()

      fireEvent.press(button!)

      expect(navigate).toHaveBeenCalledWith("/orders/internal-id/payment/new", {
        modal: true,
        passProps: { orderID: "internal-id", title: "Update Payment Details" },
      })
    })
    it("is not visible when the displayState is not PAYMENT_FAILED", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "SUBMITTED",
        }),
      })

      const button = screen.queryByTestId("update-payment-button")
      expect(button).not.toBeOnTheScreen()
    })
  })

  describe("view order button", () => {
    it("is visible when the order is submitted", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
        }),
      })

      expect(screen.getByTestId("view-order-button")).toBeOnTheScreen()
    })

    it("is not visible when the order is canceled", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "CANCELED",
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("is not visible when the order is refunded", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "REFUNDED",
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("shows 'view order' when the order is submitted", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
          mode: "BUY",
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Order")
    })

    it("shows 'view offer' when the order has a submitted offer", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
          mode: "OFFER",
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Offer")
    })

    it("shows 'view offer' when the order has an approved offer", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "APPROVED",
          mode: "OFFER",
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Offer")
    })

    it("navigates to the counteroffer when the order has a submitted offer", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "SUBMITTED",
          mode: "OFFER",
          buyerAction: "OFFER_RECEIVED",
        }),
      })
      const button = screen.getByTestId("counteroffer-button")

      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith("/orders/internal-id", {
        modal: true,
        passProps: { orderID: "internal-id", title: "Review Offer" },
      })
    })

    it("navigates to the purchase summary when the order has a processing offer", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "PROCESSING",
          mode: "OFFER",
        }),
      })

      const button = screen.getByTestId("view-order-button")
      fireEvent.press(button)
      expect(navigate).toHaveBeenCalledWith("/user/purchases/internal-id")
    })
  })
})
