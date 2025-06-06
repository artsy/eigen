import { screen } from "@testing-library/react-native"
import { TrackOrderSectionTestsQuery } from "__generated__/TrackOrderSectionTestsQuery.graphql"
import { TrackOrderSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/TrackOrderSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const CommerceShipOrder = {
  displayState: "SUBMITTED",
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
  displayState: "IN_TRANSIT",
  lineItems: {
    edges: [
      {
        node: {
          shipment: {
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
    Component: (props) => <TrackOrderSectionFragmentContainer section={props.commerceOrder!} />,
    query: graphql`
      query TrackOrderSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          internalID
          ...TrackOrderSection_section
        }
      }
    `,
    variables: {},
  })

  describe("with shipment/fulfillment data", () => {
    describe("when shipped by partner (fulfillment type CommerceShip)", () => {
      it("renders fulfillment details", () => {
        renderWithRelay({ CommerceOrder: () => CommerceShipOrder })

        expect(screen.getByTestId("orderStatus")).toHaveTextContent("pending")
        expect(screen.queryByTestId("trackingNumber")).toBeFalsy()
        expect(screen.queryByTestId("noTrackingNumber")).toBeFalsy()
        expect(screen.getByTestId("shippedOn")).toHaveTextContent("Shipped on Sep 2, 2021")
        expect(screen.getByTestId("estimatedDelivery")).toHaveTextContent(
          "Estimated Delivery: Oct 2, 2021"
        )
        expect(screen.getByTestId("trackingUrl")).toHaveTextContent("View full tracking details")
      })
    })

    describe("when shipped with Arta (fulfillment type CommerceShipArta)", () => {
      it("renders shipment details", () => {
        renderWithRelay({ CommerceOrder: () => CommerceShipArtaOrder })

        expect(screen.getByTestId("orderStatus")).toHaveTextContent("in transit")
        expect(screen.queryByTestId("trackingNumber")).toHaveTextContent("Tracking: 12345678910")
        expect(screen.queryByTestId("noTrackingNumber")).toBeFalsy()
        expect(screen.getByTestId("shippedOn")).toHaveTextContent("Shipped on Oct 3, 2021")
        expect(screen.getByTestId("estimatedDelivery")).toHaveTextContent(
          "Estimated Delivery: on September 20, 2021"
        )
        expect(screen.getByTestId("trackingUrl")).toHaveTextContent("View full tracking details")
      })

      it("when delivered", () => {
        renderWithRelay({
          CommerceOrder: () => ({
            ...CommerceShipArtaOrder,
            displayState: "FULFILLED",
            lineItems: {
              edges: [
                {
                  node: {
                    shipment: { deliveryEnd: "2021-09-02T14:51:19+03:00" },
                  },
                },
              ],
            },
          }),
        })

        expect(screen.getByTestId("deliveredStatus")).toHaveTextContent("Delivered on Sep 2, 2021")
      })
    })
  })

  describe("without shipment/fulfillment data", () => {
    it("doesn't render fields when fulfillment is null", () => {
      renderWithRelay({
        CommerceOrder: () => ({
          ...CommerceShipOrder,
          lineItems: { edges: [{ node: { shipment: null, fulfillments: null } }] },
        }),
      })

      expect(screen.getByTestId("orderStatus")).toHaveTextContent("pending")
      expect(screen.queryByTestId("trackingNumber")).toBeFalsy()
      expect(screen.getByTestId("noTrackingNumber")).toHaveTextContent("Tracking not available")
      expect(screen.queryByTestId("shippedOn")).toBeFalsy()
      expect(screen.queryByTestId("estimatedDelivery")).toBeFalsy()
      expect(screen.queryByTestId("trackingUrl")).toBeFalsy()
    })
  })
})
