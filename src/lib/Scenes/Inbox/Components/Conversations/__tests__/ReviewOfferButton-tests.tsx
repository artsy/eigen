import { ReviewOfferButtonTestsQuery } from "__generated__/ReviewOfferButtonTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { AlertCircleFillIcon } from "palette"
import { MoneyFillIcon } from "palette/svgs/MoneyFillIcon"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ReviewOfferButton, ReviewOfferButtonFragmentContainer } from "../ReviewOfferButton"
jest.unmock("react-relay")

describe("ReviewOfferButton", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ReviewOfferButtonTestsQuery>
      environment={env}
      query={graphql`
        query ReviewOfferButtonTestsQuery($orderID: ID!) @relay_test_operation {
          order: commerceOrder(id: $orderID) {
            ...ReviewOfferButton_order
          }
        }
      `}
      variables={{ orderID: "test-order" }}
      render={({ error, props }) => {
        if (props?.order) {
          return <ReviewOfferButtonFragmentContainer order={props.order} />
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

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ReviewOfferButton)).toHaveLength(1)
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
    expect(text).toContain("Tap to view")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(1)
  })

  it("shows correct message for expired offers", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "CANCELED",
        stateReason: "seller_lapsed",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Expired")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(1)
  })

  it("doesn't render for pending orders", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "PENDING",
      }),
    })
    const text = extractText(wrapper.root)
    expect(text).not.toContain("Offer")
    expect(text).not.toContain("Tap to view")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(0)
  })

  it("doesn't render for abandoned orders", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "ABANDONED",
      }),
    })
    const text = extractText(wrapper.root)
    expect(text).not.toContain("Offer")
    expect(text).not.toContain("Tap to view")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(0)
  })

  it("doesn't render when the last offer is from a buyer and it has not been accepted or rejected by the seller", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "BUYER",
        },
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).not.toContain("Offer Received")
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(0)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "APPROVED",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted - Please Confirm")
  })

  it("shows correct message and icon for received counteroffers", () => {
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
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
  })

  it("shows correct messaging and icon when offer is a counteroffer", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "SUBMITTED",
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
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
  })

  it("tapping it opens the review offer webview", () => {
    const wrapper = getWrapper({
      CommerceOrder: () => ({
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "SELLER",
        },
        offers: {
          edges: [{ node: { internalID: "1234" } }, { node: { internalID: "4567" } }],
        },
      }),
    })

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/orders/<CommerceOfferOrder-mock-id-2>")
  })
})
