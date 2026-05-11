import { fireEvent, screen } from "@testing-library/react-native"
import { OrderHistoryRowTestsQuery } from "__generated__/OrderHistoryRowTestsQuery.graphql"
import { OrderHistoryRowContainer } from "app/Scenes/OrderHistory/OrderHistoryRow"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockOrder = {
  internalID: "d1105415-4a55-4c3b-b71d-bfae06ec92df",
  buyerState: "SUBMITTED",
  buyerTotal: { display: "11,200" },
  createdAt: "2021-05-18T14:45:20+03:00",
  itemsTotal: { display: "€11,000" },
  displayTexts: {
    stateName: "pending",
    actionPrompt: "View Order",
  },
  deliveryInfo: null,
  lineItems: [
    {
      artworkVersion: {
        image: {
          resized: {
            url: "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fit&width=55&height=44&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Ft06Xa3hKNRbLcO2t6MWOyQ%2Flarge.jpg",
          },
          blurhash: "test-blurhash",
        },
      },
      artwork: {
        partner: { name: "Andrea Festa Fine Art" },
        title: "NUDIST NO. 5",
        artistNames: "Torbjørn Rødland",
      },
    },
  ],
}

describe("OrderHistoryRow", () => {
  const { renderWithRelay } = setupTestWrapper<OrderHistoryRowTestsQuery>({
    Component: (props) => {
      const order = props.me?.ordersConnection?.edges?.[0]?.node
      return order ? <OrderHistoryRowContainer order={order} /> : null
    },
    query: graphql`
      query OrderHistoryRowTestsQuery @relay_test_operation {
        me {
          ordersConnection(first: 1) {
            edges {
              node {
                ...OrderHistoryRow_order
              }
            }
          }
        }
      }
    `,
  })

  it("displays the artist name", () => {
    renderWithRelay({ Order: () => mockOrder })

    expect(screen.getByText("Torbjørn Rødland")).toBeOnTheScreen()
  })

  it("displays the partner name", () => {
    renderWithRelay({ Order: () => mockOrder })

    expect(screen.getByText("Andrea Festa Fine Art")).toBeOnTheScreen()
  })

  it("displays the order creation date", () => {
    renderWithRelay({ Order: () => mockOrder })

    expect(screen.getByText("5/18/2021")).toBeOnTheScreen()
  })

  it("displays the price", () => {
    renderWithRelay({ Order: () => mockOrder })

    expect(screen.getByText("11,200")).toBeOnTheScreen()
  })

  it("displays the buyer state", () => {
    renderWithRelay({ Order: () => mockOrder })

    expect(screen.getByText("pending")).toBeOnTheScreen()
  })

  describe("artwork image", () => {
    it("displays the image", () => {
      renderWithRelay({ Order: () => mockOrder })

      expect(screen.getByTestId("image")).toBeOnTheScreen()
    })

    it("displays a gray box unless there is an image", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          lineItems: [
            {
              ...mockOrder.lineItems[0],
              artworkVersion: {
                image: null,
              },
            },
          ],
        }),
      })

      expect(screen.getByTestId("image-box")).toBeOnTheScreen()
    })
  })

  describe("track package button", () => {
    it("is visible when a tracking URL is provided in deliveryInfo", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          deliveryInfo: { trackingURL: "https://tracking.com", trackingNumber: null },
        }),
      })

      expect(screen.getByTestId("track-package-button")).toBeOnTheScreen()
    })

    it("is not visible unless tracking information is provided", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          deliveryInfo: null,
        }),
      })

      expect(screen.queryByTestId("track-package-button")).not.toBeOnTheScreen()
    })
  })

  describe("update payment method button", () => {
    it("includes a message and button go fix payment when the buyerState is PAYMENT_FAILED", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          internalID: "internal-id",
          buyerState: "PAYMENT_FAILED",
          displayTexts: {
            stateName: "payment failed",
            actionPrompt: "Update Payment Method",
          },
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
    it("is not visible when the buyerState is not PAYMENT_FAILED", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          internalID: "internal-id",
          buyerState: "SUBMITTED",
        }),
      })

      const button = screen.queryByTestId("update-payment-button")
      expect(button).not.toBeOnTheScreen()
    })
  })

  describe("view order button", () => {
    it("is visible when the order is submitted and has an actionPrompt", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "SUBMITTED",
          displayTexts: {
            stateName: "pending",
            actionPrompt: "View Order",
          },
        }),
      })

      expect(screen.getByTestId("view-order-button")).toBeOnTheScreen()
    })

    it("is not visible when the order is canceled (terminal state)", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "CANCELED",
          displayTexts: {
            stateName: "canceled",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("is not visible when the order is refunded (terminal state)", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "REFUNDED",
          displayTexts: {
            stateName: "refunded",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("is not visible for DECLINED_BY_SELLER state", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "DECLINED_BY_SELLER",
          displayTexts: {
            stateName: "declined by seller",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("is not visible for DECLINED_BY_BUYER state", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "DECLINED_BY_BUYER",
          displayTexts: {
            stateName: "declined by buyer",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.queryByTestId("view-order-button")).not.toBeOnTheScreen()
    })

    it("shows the actionPrompt text for a submitted order", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "SUBMITTED",
          mode: "BUY",
          displayTexts: {
            stateName: "pending",
            actionPrompt: "View Order",
          },
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Order")
    })

    it("shows 'View Order' as default when actionPrompt is null for BUY mode", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "SUBMITTED",
          mode: "BUY",
          displayTexts: {
            stateName: "pending",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Order")
    })

    it("shows 'View Offer' as default when actionPrompt is null for OFFER mode", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          buyerState: "SUBMITTED",
          mode: "OFFER",
          displayTexts: {
            stateName: "pending",
            actionPrompt: null,
          },
        }),
      })

      expect(screen.getByTestId("view-order-button")).toHaveTextContent("View Offer")
    })

    it("navigates to the counteroffer when the order has OFFER_RECEIVED state", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          internalID: "internal-id",
          buyerState: "OFFER_RECEIVED",
          displayTexts: {
            stateName: "counteroffer received",
            actionPrompt: "Respond",
          },
        }),
      })
      const button = screen.getByTestId("counteroffer-button")

      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith("/orders/internal-id/respond", {
        modal: true,
        passProps: { orderID: "internal-id", title: "Respond" },
      })
    })

    it("navigates to the correct order details", () => {
      renderWithRelay({
        Order: () => ({
          ...mockOrder,
          internalID: "internal-id",
          buyerState: "PROCESSING_PAYMENT",
          displayTexts: {
            stateName: "processing payment",
            actionPrompt: "View Order",
          },
        }),
      })

      fireEvent.press(screen.getByTestId("view-order-button"))

      expect(navigate).toHaveBeenCalledWith("/orders/internal-id/details")
    })
  })
})
