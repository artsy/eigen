import { OfferNotificationTestsQuery } from "__generated__/OfferNotificationTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OfferNotification, OfferNotificationFragmentContainer } from "../OfferNotification"
jest.unmock("react-relay")

describe("OfferNotification", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<OfferNotificationTestsQuery>
      environment={env}
      query={graphql`
        query OfferNotificationTestsQuery($orderID: ID!) @relay_test_operation {
          order: commerceOrder(id: $orderID) {
            offers {
              ...OfferNotification_offer
            }
          }
        }
      `}
      variables={{ orderID: "test-order" }}
      render={({ error, props }) => {
        if (props?.order) {
          return <OfferNotificationFragmentContainer showTimeSince={true} offer={props.order.offers[0]} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it.only("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(OfferNotification)).toHaveLength(1)
  })

  it("shows correct message for rejected offers", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "CANCELED",
        stateReason: "seller_rejected",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Declined")
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "PENDING",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted - Please Confirm")
  })

  it("shows correct message for received counteroffers", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "SELLER",
        },
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Received")
  })

  it("shows correct messaging when offer is a counteroffer", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        lastOffer: {
          fromParticipant: "SELLER",
        },
        offers: {
          edges: [{ node: { internalID: "1234" } }, { node: { internalID: "4567" } }],
        },
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
  })

  it("tapping it opens the review offer webview when an order has not yet been approved", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        offers: {
          edges: [{ node: { internalID: "1234" } }, { node: { internalID: "4567" } }],
        },
      }),
    })

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/orders/<CommerceOrder-mock-id-1>/review")
  })
})
