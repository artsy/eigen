import { OrderDetailsHeaderTestsQuery } from "__generated__/OrderDetailsHeaderTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { OrderDetailsHeaderFragmentContainer } from "./Components/OrderDetailsHeader"

jest.unmock("react-relay")

const mockInfo = {
  createdAt: "2021-06-02T14:51:19+03:00",
  code: "075381384",
  state: "SUBMITTED",
  requestedFulfillment: { __typename: "CommerceShip" },
  lineItems: { edges: [{ node: { shipment: null } }] },
}

describe("OrderDetailsHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<OrderDetailsHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OrderDetailsHeaderTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...OrderDetailsHeader_info
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <OrderDetailsHeaderFragmentContainer info={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  it("renders date, code, status, fulfillment fields", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => mockInfo })

    expect(extractText(tree.findByProps({ testID: "date" }))).toBe("Jun 2, 2021")
    expect(extractText(tree.findByProps({ testID: "code" }))).toBe("075381384")
    expect(extractText(tree.findByProps({ testID: "status" }))).toBe("pending")
    expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
  })

  describe("Renders correctly status and fulfillment fields", () => {
    describe("Renders correctly status and fulfillment fields", () => {
      describe("CommerceShip", () => {
        it("SUBMITTED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, { CommerceOrder: () => mockInfo })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("pending")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("APPROVED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({ ...mockInfo, state: "APPROVED" }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("confirmed")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("FULFILLED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({ ...mockInfo, state: "FULFILLED" }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })
      })

      describe("CommerceShipArtA", () => {
        it("PENDING status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "pending" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("processing")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("CONFIRMED status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "confirmed" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("processing")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("COLLECTED status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "collected" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("in transit")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("IN_TRANSIT status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "in_transit" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("in transit")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("COMPLETED status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "completed" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })

        it("CANCELED status", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              lineItems: { edges: [{ node: { shipment: { status: "canceled" } } }] },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("canceled")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Delivery")
        })
      })

      describe("CommercePickup", () => {
        it("SUBMITTED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("pending")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })

        it("APPROVED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              state: "APPROVED",
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("confirmed")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })

        it("FULFILLED state", () => {
          const tree = renderWithWrappers(<TestRenderer />).root
          resolveMostRecentRelayOperation(mockEnvironment, {
            CommerceOrder: () => ({
              ...mockInfo,
              state: "FULFILLED",
              requestedFulfillment: { __typename: "CommercePickup" },
            }),
          })

          expect(extractText(tree.findByProps({ testID: "status" }))).toBe("delivered")
          expect(extractText(tree.findByProps({ testID: "fulfillment" }))).toBe("Pickup")
        })
      })
    })
  })
})
