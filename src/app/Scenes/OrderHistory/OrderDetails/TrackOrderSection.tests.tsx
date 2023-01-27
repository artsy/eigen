import { TrackOrderSectionTestsQuery } from "__generated__/TrackOrderSectionTestsQuery.graphql"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { TrackOrderSectionFragmentContainer } from "./Components/TrackOrderSection"

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
  const { renderWithRelay } = setupTestWrapper<TrackOrderSectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <TrackOrderSectionFragmentContainer section={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query TrackOrderSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          internalID
          ...TrackOrderSection_section
        }
      }
    `,
  })

  describe("when CommerceShip", () => {
    it("renders section", () => {
      const tree = renderWithRelay({ CommerceOrder: () => CommerceShipOrder })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "orderStatus" }))).toBe("pending")
      expect(tree.UNSAFE_getAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.UNSAFE_getByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "shippedOn" }))).toContain("Sep 2, 2021")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "estimatedDelivery" }))).toContain(
        "Oct 2, 2021"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "trackingUrl" }))).toContain(
        "View full tracking details"
      )
    })

    it("not renders fields without data", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => ({
          ...CommerceShipOrder,
          lineItems: { edges: [{ node: { shipment: null, fulfillments: null } }] },
        }),
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "orderStatus" }))).toBe("pending")
      expect(tree.UNSAFE_getAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.UNSAFE_getByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(tree.UNSAFE_getAllByProps({ testID: "shippedOn" })).toHaveLength(0)
      expect(tree.UNSAFE_getAllByProps({ testID: "estimatedDelivery" })).toHaveLength(0)
      expect(tree.UNSAFE_getAllByProps({ testID: "trackingUrl" })).toHaveLength(0)
    })
  })

  describe("when CommerceShipArta", () => {
    it("renders section", () => {
      const tree = renderWithRelay({
        CommerceOrder: () => CommerceShipArtaOrder,
      })

      expect(extractText(tree.UNSAFE_getByProps({ testID: "orderStatus" }))).toBe("in transit")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "trackingNumber" }))).toContain(
        "12345678910"
      )
      expect(tree.UNSAFE_getAllByProps({ testID: "noTrackingNumber" })).toHaveLength(0)
      expect(extractText(tree.UNSAFE_getByProps({ testID: "shippedOn" }))).toContain("Oct 3, 2021")
      expect(extractText(tree.UNSAFE_getByProps({ testID: "estimatedDelivery" }))).toContain(
        "on September 20, 2021"
      )
      expect(extractText(tree.UNSAFE_getByProps({ testID: "trackingUrl" }))).toContain(
        "View full tracking details"
      )
    })

    it("not renders fields without data", () => {
      const tree = renderWithRelay({
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

      expect(extractText(tree.UNSAFE_getByProps({ testID: "orderStatus" }))).toBe("in transit")
      expect(tree.UNSAFE_getAllByProps({ testID: "trackingNumber" })).toHaveLength(0)
      expect(extractText(tree.UNSAFE_getByProps({ testID: "noTrackingNumber" }))).toBe(
        "Tracking not available"
      )
      expect(tree.UNSAFE_getAllByProps({ testID: "shippedOn" })).toHaveLength(0)
      expect(tree.UNSAFE_getAllByProps({ testID: "estimatedDelivery" })).toHaveLength(0)
      expect(tree.UNSAFE_getAllByProps({ testID: "trackingUrl" })).toHaveLength(0)
    })

    it("when delivered", () => {
      const tree = renderWithRelay({
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

      expect(extractText(tree.UNSAFE_getByProps({ testID: "deliveredStatus" }))).toBe(
        "Delivered on Sep 2, 2021"
      )
    })
  })

  // describe("when CommercePickup", () => {
  //   it("not renders section", () => {
  //     const tree = renderWithRelay({
  //       CommerceOrder: () => ({
  //         ...CommerceShipOrder,
  //         requestedFulfillment: { __typename: "CommercePickup" },
  //         lineItems: { edges: [{ node: { shipment: null, fulfillments: null } }] },
  //       }),
  //     })

  //     expect(tree).toBeNull()
  //   })
  // })
})
