import { fireEvent } from "@testing-library/react-native"
import { OrderHistoryRowTestsQuery } from "__generated__/OrderHistoryRowTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

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
      if (props?.commerceOrder) {
        return <OrderHistoryRowContainer order={props.commerceOrder} />
      }
      return null
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
    const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(tree.queryByTestId("artist-names")?.children[0]).toBe("Torbjørn Rødland")
  })

  it("displays the partner name", () => {
    const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(tree.queryByTestId("partner-name")?.children[0]).toBe("Andrea Festa Fine Art")
  })

  it("displays the order creation date", () => {
    const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(tree.queryByTestId("date")?.children[0]).toBe("5/18/2021")
  })

  it("displays the price", () => {
    const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(tree.queryByTestId("price")?.children[0]).toBe("11,200")
  })

  it("displays the display state", () => {
    const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

    expect(tree.queryByTestId("order-status")?.children[0]).toBe("pending")
  })

  describe("artwork image", () => {
    it("displays the image", () => {
      const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

      expect(tree.queryByTestId("image")).toBeTruthy()
    })

    it("displays a gray box unless there is an image", () => {
      const tree = renderWithRelay({
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

      expect(tree.queryByTestId("image-box")).toBeTruthy()
    })
  })

  describe("track package button", () => {
    it("is visible when a tracking URL is provided", () => {
      const tree = renderWithRelay({
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

      expect(tree.queryByTestId("track-package-button")).toBeTruthy()
    })

    it("is visible when a tracking number is provided", () => {
      const tree = renderWithRelay({
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

      expect(tree.queryByTestId("track-package-button")).toBeTruthy()
    })

    it("is visible when a tracking ID is provided", () => {
      const tree = renderWithRelay({
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

      expect(tree.queryByTestId("track-package-button")).toBeTruthy()
    })

    it("is not visible unless tracking information is provided", () => {
      const tree = renderWithRelay({
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

      expect(tree.queryByTestId("track-package-button")).toBeNull()
    })
  })

  describe("view order button", () => {
    it("is visible when the order is submitted", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
        }),
      })

      expect(tree.queryByTestId("view-order-button")).toBeTruthy()
    })

    it("is not visible when the order is canceled", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "CANCELED",
        }),
      })

      expect(tree.queryByTestId("view-order-button")).toBeNull()
    })

    it("is not visible when the order is refunded", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "REFUNDED",
        }),
      })

      expect(tree.queryByTestId("view-order-button")).toBeNull()
    })

    it("shows 'view order' when the order is submitted", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
          mode: "BUY",
        }),
      })

      expect(extractText(tree.getByTestId("view-order-button"))).toContain("View Order")
    })

    it("shows 'view offer' when the order has a submitted offer", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "SUBMITTED",
          mode: "OFFER",
        }),
      })

      expect(extractText(tree.getByTestId("view-order-button"))).toContain("View Offer")
    })

    it("shows 'view order' when the order has an approved offer", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          displayState: "APPROVED",
          mode: "OFFER",
        }),
      })

      expect(extractText(tree.getByTestId("view-order-button"))).toContain("View Order")
    })

    it("navigates to the counteroffer when the order has a submitted offer", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "SUBMITTED",
          mode: "OFFER",
        }),
      })
      const button = tree.UNSAFE_getByProps({ testID: "view-order-button" })

      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith("/orders/internal-id", {
        modal: true,
        passProps: { orderID: "internal-id", title: "Make Offer" },
      })
    })

    it("navigates to the purchase summary when the order has a processing offer", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...mockOrder,
          internalID: "internal-id",
          displayState: "PROCESSING",
          mode: "OFFER",
        }),
      })

      const button = tree.getByTestId("view-order-button")
      fireEvent.press(button)
      expect(navigate).toHaveBeenCalledWith("/user/purchases/internal-id")
    })
  })
})
