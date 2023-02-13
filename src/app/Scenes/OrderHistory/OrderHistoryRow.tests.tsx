import { fireEvent } from "@testing-library/react-native"
import { OrderHistoryRowTestsQuery } from "__generated__/OrderHistoryRowTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Button } from "palette"
import { graphql } from "react-relay"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

const mockOrder = {
  internalID: "d1105415-4a55-4c3b-b71d-bfae06ec92df",
  state: "SUBMITTED",
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

describe("Order history row", () => {
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

  describe("Render Order", () => {
    it("with all fields", () => {
      const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "artist-names" }))).toBe(
        "Torbjørn Rødland"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "partner-name" }))).toBe(
        "Andrea Festa Fine Art"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "date" }))).toBe("5/18/2021")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "price" }))).toBe("11,200")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("pending")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "view-order-button" }))).toContain(
        "View Order"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "track-package-button" }))).toContain(
        "Track Package"
      )
      expect(
        tree.UNSAFE_getByProps({ testID: "image-container" }).findByProps({ testID: "image" })
      ).toBeTruthy()
    })

    describe("Offer mode", () => {
      it("View Offer button when SUBMITTED state", () => {
        const tree = renderWithRelay({
          CommerceOrder: () => ({ ...mockOrder, mode: "OFFER" }),
        })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "view-order-button" }))).toContain(
          "View Offer"
        )
      })

      it("View Order button when APPROVED state", () => {
        const tree = renderWithRelay({
          CommerceOrder: () => ({ ...mockOrder, state: "APPROVED", mode: "OFFER" }),
        })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "view-order-button" }))).toContain(
          "View Order"
        )
      })
    })

    it("with gray box if no image", () => {
      const order = {
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
      }
      const tree = renderWithRelay({ CommerceOrder: () => order })

      expect(
        tree.UNSAFE_getByProps({ testID: "image-container" }).findByProps({ testID: "image-box" })
      ).toBeTruthy()
    })
  })

  describe("Orders without shipment status", () => {
    it("SUBMITTED order", () => {
      const tree = renderWithRelay({ CommerceOrder: () => mockOrder })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("pending")
    })

    it("APPROVED order", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({ ...mockOrder, state: "APPROVED" }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("confirmed")
    })

    it("PROCESSING_APPROVAL order", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({ ...mockOrder, state: "PROCESSING_APPROVAL" }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toContain(
        "payment processing"
      )
    })

    it("FULFILLED order", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({ ...mockOrder, state: "FULFILLED" }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("delivered")
    })

    it("CANCELED order", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({ ...mockOrder, state: "CANCELED" }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("canceled")
    })

    describe("CANCELED/REFUNDED orders overrides any shipment status", () => {
      const order = {
        ...mockOrder,
        state: "CANCELED",
        lineItems: {
          edges: [
            {
              node: {
                ...mockOrder.lineItems.edges[0].node,
                shipment: { status: "in_transit", trackingUrl: null, trackingNumber: null },
                fulfillments: { edges: [{ node: { trackingId: null } }] },
              },
            },
          ],
        },
      }
      it("CANCELED order without trackingId", () => {
        const tree = renderWithRelay({ CommerceOrder: () => order })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("canceled")
        expect(tree.UNSAFE_getByProps({ testID: "view-order-button-box" })).not.toContain(Button)
      })

      it("REFUNDED order without trackingId", () => {
        const tree = renderWithRelay({
          CommerceOrder: () => ({ ...order, state: "REFUNDED" }),
        })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("refunded")
        expect(tree.UNSAFE_getByProps({ testID: "view-order-button-box" })).not.toContain(Button)
      })
    })
  })

  describe("Offers with shipments", () => {
    describe("when offer is still in negotiation with draft shipment status", () => {
      const order = {
        ...mockOrder,
        mode: "OFFER",
        state: "SUBMITTED",
        lineItems: {
          edges: [
            {
              node: {
                ...mockOrder.lineItems.edges[0].node,
                shipment: { status: "draft" },
              },
            },
          ],
        },
      }

      it("displays the correct order status", () => {
        const tree = renderWithRelay({ CommerceOrder: () => order })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("pending")
      })

      it("directs user to the orders counter offer modal on button press", () => {
        const tree = renderWithRelay({ CommerceOrder: () => order })
        const button = tree.UNSAFE_getByProps({ testID: "view-order-button" })

        fireEvent.press(button)

        expect(navigate).toHaveBeenCalledWith(`/orders/${mockOrder.internalID}`, {
          modal: true,
          passProps: { orderID: `${mockOrder.internalID}`, title: "Make Offer" },
        })
      })
    })

    describe("Approved Offers with shipment status", () => {
      const order = {
        ...mockOrder,
        mode: "OFFER",
        state: "APPROVED",
        lineItems: {
          edges: [
            {
              node: {
                ...mockOrder.lineItems.edges[0].node,
                shipment: { status: "pending" },
              },
            },
          ],
        },
      }

      it("directs user to the purchase summary screen on button press", () => {
        const tree = renderWithRelay({ CommerceOrder: () => order })
        const button = tree.UNSAFE_getByProps({ testID: "view-order-button" })

        fireEvent.press(button)

        expect(navigate).toHaveBeenCalledWith(`/user/purchases/${order.internalID}`)
      })

      it("displays the correct order status", () => {
        const tree = renderWithRelay({ CommerceOrder: () => order })

        expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("processing")
      })
    })
  })

  describe("Orders with shipment status", () => {
    const order = {
      ...mockOrder,
      state: "APPROVED",
      lineItems: {
        edges: [
          {
            node: {
              ...mockOrder.lineItems.edges[0].node,
              shipment: { status: "pending" },
            },
          },
        ],
      },
    }

    it("PENDING shipment status", () => {
      const tree = renderWithRelay({ CommerceOrder: () => order })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("processing")
    })

    it("CONFIRMED shipment status", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...order,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { status: "confirmed" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("processing")
    })

    it("COLLECTED shipment status", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...order,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { status: "collected" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("in transit")
    })

    it("IN_TRANSIT shipment status", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...order,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { status: "in_transit" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("in transit")
    })

    it("COMPLETE shipment status", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...order,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { status: "completed" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("delivered")
    })

    it("CANCELED shipment status", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...order,
          lineItems: {
            edges: [
              {
                node: {
                  ...mockOrder.lineItems.edges[0].node,
                  shipment: { status: "canceled" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "order-status" }))).toBe("canceled")
    })
  })
})
