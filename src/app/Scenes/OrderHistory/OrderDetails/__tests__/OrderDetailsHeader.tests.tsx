import { OrderDetailsHeaderTestsQuery } from "__generated__/OrderDetailsHeaderTestsQuery.graphql"
import { OrderDetailsHeaderFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsHeader"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockInfo = {
  createdAt: "2021-06-02T14:51:19+03:00",
  code: "075381384",
  requestedFulfillment: { __typename: "CommerceShip" },
  lineItems: { edges: [{ node: { shipment: null } }] },
}

describe("OrderDetailsHeader", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailsHeaderTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <OrderDetailsHeaderFragmentContainer info={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query OrderDetailsHeaderTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...OrderDetailsHeader_info
        }
      }
    `,
  })

  it("renders date, code, status, fulfillment fields", () => {
    const tree = renderWithRelay({
      CommerceOrder: () => ({ ...mockInfo, displayState: "SUBMITTED" }),
    })

    expect(extractText(tree.UNSAFE_getByProps({ testID: "date" }))).toBe("Jun 2, 2021")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "code" }))).toBe("075381384")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("pending")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
  })

  describe("Renders correctly status and fulfillment fields", () => {
    describe("Renders correctly status and fulfillment fields", () => {
      describe("CommerceShip", () => {
        it("SUBMITTED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({ ...mockInfo, displayState: "SUBMITTED" }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("pending")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("APPROVED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({ ...mockInfo, displayState: "APPROVED" }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("confirmed")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("FULFILLED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({ ...mockInfo, displayState: "FULFILLED" }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })
      })

      describe("CommerceShipArtA", () => {
        it("PROCESSING displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "PROCESSING",
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("processing")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("IN_TRANSIT displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "IN_TRANSIT",
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("in transit")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("FULFILLED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "FULFILLED",
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("CANCELED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "CANCELED",
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("canceled")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })
      })

      describe("CommercePickup", () => {
        it("SUBMITTED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "SUBMITTED",
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("pending")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })

        it("APPROVED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "APPROVED",
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("confirmed")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })

        it("FULFILLED displayState", () => {
          const tree = renderWithRelay({
            CommerceOrder: () => ({
              ...mockInfo,
              displayState: "FULFILLED",
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.UNSAFE_getByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.UNSAFE_getByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })
      })
    })
  })
})
