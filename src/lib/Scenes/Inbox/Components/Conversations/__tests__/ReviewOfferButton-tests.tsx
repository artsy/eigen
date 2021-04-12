import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { AlertCircleFillIcon } from "palette"
import { MoneyFillIcon } from "palette/svgs/MoneyFillIcon"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"
import { ReviewOfferButton, ReviewOfferButtonProps, ReviewOfferCTAKind } from "../ReviewOfferButton"
jest.unmock("react-relay")

describe("ReviewOfferButton", () => {
  const trackEvent = jest.fn()

  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  const getWrapper = (kind: ReviewOfferCTAKind, activeOrder: Partial<ReviewOfferButtonProps["activeOrder"]> = {}) => {
    const props = {
      conversationID: "conversation-id",
      kind,
      activeOrder: {
        internalID: "order-id",
        stateExpiresAt: new Date().toISOString(),
        lastOffer: { createdAt: new Date().toISOString() },
        offers: { edges: [{}] },
        ...activeOrder,
      },
    }
    return renderWithWrappers(<ReviewOfferButton {...props} />)
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper("PAYMENT_FAILED")
    expect(wrapper.root.findAllByType(ReviewOfferButton)).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper("OFFER_ACCEPTED", { offers: { edges: [{}] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(1)
  })

  it("shows correct message for accepted offers where payment fails", () => {
    const wrapper = getWrapper("PAYMENT_FAILED")

    const text = extractText(wrapper.root)
    expect(text).toContain("Payment Failed")
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
  })

  it("shows correct message and icon for received offers", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{}] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Received")
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
  })

  it("shows correct messaging and icon when offer is a counteroffer", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{}, {}] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
    expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
  })

  it("tapping it opens the review offer webview and tracks event", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{}, {}] } })

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedViewOffer",
      context_owner_type: "conversation",
      impulse_conversation_id: "conversation-id",
      subject: "Counteroffer Received",
    })
    expect(navigate).toHaveBeenCalledWith("/orders/order-id", {
      modal: true,
      passProps: { orderID: "order-id", title: "Make Offer" },
    })
  })
})
