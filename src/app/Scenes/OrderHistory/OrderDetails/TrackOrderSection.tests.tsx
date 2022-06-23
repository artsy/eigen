import { TrackOrderSectionTestsQuery } from "__generated__/TrackOrderSectionTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { TrackOrderSectionFragmentContainer } from "./Components/TrackOrderSection"

jest.unmock("react-relay")

const CommerceShipOrder = {
  state: "SUBMITTED",
  requestedFulfillment: { __typename: "CommerceShip" },
  lineItems: {
    edges: [
      {
        node: {
          shipment: null,
          fulfillments: {
            edges: [
              {
                node: {
                  createdAt: "2021-09-02T14:51:19+03:00",
                  trackingId: "1234567890",
                  estimatedDelivery: "2021-10-02T14:51:19+03:00",
                },
              },
            ],
          },
        },
      },
    ],
  },
}

const CommerceShipArtaOrder = {
  state: "APPROVED",
  requestedFulfillment: { __typename: "CommerceShipArta" },
  lineItems: {
    edges: [
      {
        node: {
          shipment: {
            status: "in_transit",
            trackingUrl: "https://google.com",
            trackingNumber: "12345678910",
            deliveryStart: "2021-10-03T14:51:19+03:00",
            deliveryEnd: "2021-09-02T14:51:19+03:00",
            estimatedDeliveryWindow: "on September 20, 2021",
          },
          fulfillments: null,
        },
      },
    ],
  },
}

describe("TrackOrderSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<TrackOrderSectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query TrackOrderSectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            internalID
            ...TrackOrderSection_section
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <TrackOrderSectionFragmentContainer section={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  describe("when CommerceShip", () => {
    it("renders section", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => CommerceShipOrder })

      expect(extractText(tree.findByProps({ testID: "orderStatus" }))).toBe("pending")
      expect(tree.findAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.findByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(extractText(tree.findByProps({ testID: "shippedOn" }))).toContain("Sep 2, 2021")
      expect(extractText(tree.findByProps({ testID: "estimatedDelivery" }))).toContain(
        "Oct 2, 2021"
      )
      expect(extractText(tree.findByProps({ testID: "trackingUrl" }))).toContain(
        "View full tracking details"
      )
    })

    it("not renders fields without data", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          ...CommerceShipOrder,
          lineItems: { edges: [{ node: { shipment: null, fulfillments: null } }] },
        }),
      })

      expect(extractText(tree.findByProps({ testID: "orderStatus" }))).toBe("pending")
      expect(tree.findAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.findByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(tree.findAllByProps({ testID: "shippedOn" })).toHaveLength(0)
      expect(tree.findAllByProps({ testID: "estimatedDelivery" })).toHaveLength(0)
      expect(tree.findAllByProps({ testID: "trackingUrl" })).toHaveLength(0)
    })
  })

  describe("when CommerceShipArta", () => {
    it("renders section", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => CommerceShipArtaOrder,
      })

      expect(extractText(tree.findByProps({ testID: "orderStatus" }))).toBe("in transit")
      expect(extractText(tree.findByProps({ testID: "trackingNumber" }))).toContain("12345678910")
      expect(tree.findAllByProps({ testID: "noTrackingNumber" })).toHaveLength(0)
      expect(extractText(tree.findByProps({ testID: "shippedOn" }))).toContain("Oct 3, 2021")
      expect(extractText(tree.findByProps({ testID: "estimatedDelivery" }))).toContain(
        "on September 20, 2021"
      )
      expect(extractText(tree.findByProps({ testID: "trackingUrl" }))).toContain(
        "View full tracking details"
      )
    })

    it("not renders fields without data", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          ...CommerceShipArtaOrder,
          lineItems: {
            edges: [
              {
                node: {
                  shipment: {
                    status: "in_transit",
                    trackingUrl: null,
                    trackingNumber: null,
                    deliveryStart: null,
                    deliveryEnd: null,
                    estimatedDeliveryWindow: null,
                  },
                  fulfillments: null,
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.findByProps({ testID: "orderStatus" }))).toBe("in transit")
      expect(tree.findAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.findByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(tree.findAllByProps({ testID: "shippedOn" })).toHaveLength(0)
      expect(tree.findAllByProps({ testID: "estimatedDelivery" })).toHaveLength(0)
      expect(tree.findAllByProps({ testID: "trackingUrl" })).toHaveLength(0)
    })

    it("when delivered", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          ...CommerceShipArtaOrder,
          lineItems: {
            edges: [
              {
                node: {
                  shipment: { status: "completed", deliveryEnd: "2021-09-02T14:51:19+03:00" },
                },
              },
            ],
          },
        }),
      })

      expect(extractText(tree.findByProps({ testID: "deliveredStatus" }))).toBe(
        "Delivered on Sep 2, 2021"
      )
    })
  })

  describe("when CommercePickup", () => {
    it("not renders section", () => {
      const tree = renderWithWrappers(<TestRenderer />).root
      resolveMostRecentRelayOperation(mockEnvironment, {
        CommerceOrder: () => ({
          ...CommerceShipOrder,
          requestedFulfillment: { __typename: "CommercePickup" },
          lineItems: { edges: [{ node: { shipment: null, fulfillments: null } }] },
        }),
      })

      expect(tree.instance).toBeNull()
    })
  })
})
