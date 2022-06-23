import { OrderHistoryRowTestsQuery } from "__generated__/OrderHistoryRowTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { OrderHistoryRowContainer } from "./OrderHistoryRow"

jest.unmock("react-relay")

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
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<OrderHistoryRowTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OrderHistoryRowTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...OrderHistoryRow_order
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <OrderHistoryRowContainer order={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  describe("Render Order", () => {
    it("with all fields", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => mockOrder })

      expect(extractText(tree.findByProps({ testID: "artist-names" }))).toBe("Torbjørn Rødland")
      expect(extractText(tree.findByProps({ testID: "partner-name" }))).toBe(
        "Andrea Festa Fine Art"
      )
      expect(extractText(tree.findByProps({ testID: "date" }))).toBe("5/18/2021")
      expect(extractText(tree.findByProps({ testID: "price" }))).toBe("11,200")
      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("pending")
      expect(extractText(tree.findByProps({ testID: "view-order-button" }))).toContain("View Order")
      expect(extractText(tree.findByProps({ testID: "track-package-button" }))).toContain(
        "Track Package"
      )
      expect(
        tree.findByProps({ testID: "image-container" }).findByProps({ testID: "image" })
      ).toBeTruthy()
    })

    describe("Offer mode", () => {
      it("View Offer button when SUBMITTED state", () => {
        const tree = renderWithWrappers(<TestRenderer />).root
        resolveMostRecentRelayOperation(mockEnvironment, {
          CommerceOrder: () => ({ ...mockOrder, mode: "OFFER" }),
        })

        expect(extractText(tree.findByProps({ testID: "view-order-button" }))).toContain(
          "View Offer"
        )
      })

      it("View Order button when APPROVED state", () => {
        const tree = renderWithWrappers(<TestRenderer />).root
        resolveMostRecentRelayOperation(mockEnvironment, {
          CommerceOrder: () => ({ ...mockOrder, state: "APPROVED", mode: "OFFER" }),
        })

        expect(extractText(tree.findByProps({ testID: "view-order-button" }))).toContain(
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
              },
            },
          ],
        },
      }
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => order })

      expect(
        tree.findByProps({ testID: "image-container" }).findByProps({ testID: "image-box" })
      ).toBeTruthy()
    })
  })

  describe("Orders without shipment status", () => {
    it("SUBMITTED order", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => mockOrder })

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("pending")
    })

    it("APPROVED order", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({ ...mockOrder, state: "APPROVED" }),
      })

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("confirmed")
    })

    it("FULFILLED order", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({ ...mockOrder, state: "FULFILLED" }),
      })

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("delivered")
    })

    it("CANCELED order", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({ ...mockOrder, state: "CANCELED" }),
      })

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("canceled")
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
        const tree = renderWithWrappers(<TestRenderer />).root
        resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => order })

        expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("canceled")
        expect(tree.findByProps({ testID: "view-order-button-box" })).not.toContain(Button)
      })

      it("REFUNDED order without trackingId", () => {
        const tree = renderWithWrappers(<TestRenderer />).root
        resolveMostRecentRelayOperation(mockEnvironment, {
          CommerceOrder: () => ({ ...order, state: "REFUNDED" }),
        })

        expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("refunded")
        expect(tree.findByProps({ testID: "view-order-button-box" })).not.toContain(Button)
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
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => order })

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("processing")
    })

    it("CONFIRMED shipment status", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("processing")
    })

    it("COLLECTED shipment status", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("in transit")
    })

    it("IN_TRANSIT shipment status", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("in transit")
    })

    it("COMPLETE shipment status", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("delivered")
    })

    it("CANCELED shipment status", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(extractText(tree.findByProps({ testID: "order-status" }))).toBe("canceled")
    })
  })
})
