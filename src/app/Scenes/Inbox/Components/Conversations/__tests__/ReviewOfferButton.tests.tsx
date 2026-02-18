import { AlertFillIcon, MoneyFillIcon } from "@artsy/icons/native"
import { ConversationCTA_conversation$data } from "__generated__/ConversationCTA_conversation.graphql"
import {
  ReviewOfferButton,
  ReviewOfferButtonProps,
  ReviewOfferCTAKind,
} from "app/Scenes/Inbox/Components/Conversations/ReviewOfferButton"
import { navigate } from "app/system/navigation/navigate"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { extractText } from "app/utils/tests/extractText"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { DateTime } from "luxon"
import { TouchableWithoutFeedback } from "react-native"

describe("ReviewOfferButton", () => {
  const getWrapper = (
    kind: ReviewOfferCTAKind,
    activeOrder: Partial<ReviewOfferButtonProps["activeOrder"]> = {} as any
  ) => {
    const props = {
      conversationID: "conversation-id",
      kind,
      activeOrder: {
        internalID: "order-id",
        stateExpiresAt: new Date().toISOString(),
        lastOffer: { createdAt: new Date().toISOString() },
        offers: { edges: [{} as any] },
        ...activeOrder,
      } as ExtractNodeType<ConversationCTA_conversation$data["activeOrders"]>,
    }
    return renderWithWrappersLEGACY(<ReviewOfferButton {...props} />)
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper("PAYMENT_FAILED")
    expect(wrapper.root.findAllByType(ReviewOfferButton)).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper("OFFER_ACCEPTED", { offers: { edges: [{} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper("OFFER_ACCEPTED_CONFIRM_NEEDED", { offers: { edges: [{} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted - Confirm total")
    expect(wrapper.root.findAllByType(AlertFillIcon)).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper("OFFER_RECEIVED_CONFIRM_NEEDED", { offers: { edges: [{} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received - Confirm Total")
    expect(wrapper.root.findAllByType(AlertFillIcon)).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    const wrapper = getWrapper("PROVISIONAL_OFFER_ACCEPTED", { offers: { edges: [{} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Accepted")
    expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(1)
  })

  it("shows correct message for accepted offers where payment fails", () => {
    const wrapper = getWrapper("PAYMENT_FAILED")

    const text = extractText(wrapper.root)
    expect(text).toContain("Unable to process payment for accepted offer. Update payment method.")
    expect(wrapper.root.findAllByType(AlertFillIcon)).toHaveLength(1)
  })

  it("shows correct message and icon for received offers", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Offer Received")
    expect(wrapper.root.findAllByType(AlertFillIcon)).toHaveLength(1)
  })

  it("shows correct messaging and icon when offer is a counteroffer", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{} as any, {} as any] } })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
    expect(wrapper.root.findAllByType(AlertFillIcon)).toHaveLength(1)
  })

  it("shows correct expiration in minutes when there is less than 1 hour left", () => {
    const expirationTime = DateTime.local().plus({ minutes: 31 })
    const wrapper = getWrapper("OFFER_RECEIVED", {
      offers: { edges: [{} as any, {} as any] },
      stateExpiresAt: expirationTime.toString(),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
    expect(text).toContain("The offer expires in 30m")
  })

  it("shows correct expiration in hours when there is more than 1 hour left", () => {
    const expirationTime = DateTime.local().plus({ hours: 10 })
    const wrapper = getWrapper("OFFER_RECEIVED", {
      offers: { edges: [{} as any, {} as any] },
      stateExpiresAt: expirationTime.toString(),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
    expect(text).toContain("The offer expires in 10hr")
  })

  it("shows correct expiration in hours when there is more than 24 hours left", () => {
    const expirationTime = DateTime.local().plus({ hours: 72 })
    const wrapper = getWrapper("OFFER_RECEIVED", {
      offers: { edges: [{} as any, {} as any] },
      stateExpiresAt: expirationTime.toString(),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("Counteroffer Received")
    expect(text).toContain("The offer expires in 72hr")
  })

  it("tapping it opens the review offer webview with the correct modal title and tracks event", () => {
    const wrapper = getWrapper("OFFER_RECEIVED", { offers: { edges: [{} as any, {} as any] } })

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedViewOffer",
      context_owner_type: "conversation",
      impulse_conversation_id: "conversation-id",
      subject: "Counteroffer Received",
    })
    expect(navigate).toHaveBeenCalledWith("/orders/order-id", {
      modal: true,
      passProps: { orderID: "order-id", title: "Review Offer" },
    })
  })

  it("tapping it opens the correct webview with the correct title for offers where payment fails", () => {
    const wrapper = getWrapper("PAYMENT_FAILED", { offers: { edges: [{} as any, {} as any] } })

    wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/orders/order-id/payment/new", {
      modal: true,
      passProps: { orderID: "order-id", title: "Update Payment Details" },
    })
  })
})
