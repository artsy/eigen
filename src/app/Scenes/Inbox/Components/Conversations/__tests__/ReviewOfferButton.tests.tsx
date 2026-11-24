import { screen, userEvent } from "@testing-library/react-native"
import { ConversationCTA_conversation$data } from "__generated__/ConversationCTA_conversation.graphql"
import {
  ReviewOfferButton,
  ReviewOfferButtonProps,
  ReviewOfferCTAKind,
} from "app/Scenes/Inbox/Components/Conversations/ReviewOfferButton"
import { navigate } from "app/system/navigation/navigate"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { DateTime } from "luxon"

// Wrap the icons in host views we can query, so the tests can tell which one rendered.
jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  const actual = jest.requireActual("@artsy/icons/native")

  return {
    ...actual,
    AlertFillIcon: (props: any) => (
      <View testID="alert-fill-icon">
        <actual.AlertFillIcon {...props} />
      </View>
    ),
    MoneyFillIcon: (props: any) => (
      <View testID="money-fill-icon">
        <actual.MoneyFillIcon {...props} />
      </View>
    ),
  }
})

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Asserts that a rendered text contains `string`. */
const expectText = (string: string) =>
  expect(screen.getByText(new RegExp(escapeRegExp(string)))).toBeOnTheScreen()

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
        buyerStateExpiresAt: new Date().toISOString(),
        lastSubmittedOffer: { createdAt: new Date().toISOString() },
        submittedOffers: [{ internalID: "offer-1" }],
        ...activeOrder,
      } as ExtractNodeType<ConversationCTA_conversation$data["activeCollectorOrders"]>,
    }
    return renderWithWrappers(<ReviewOfferButton {...props} />)
  }

  it("renders without throwing an error", () => {
    getWrapper("PAYMENT_FAILED")
    expect(screen.getByRole("button")).toBeOnTheScreen()
  })

  it("shows correct message for accepted offers", () => {
    getWrapper("OFFER_ACCEPTED", { submittedOffers: [{ internalID: "offer-1" }] })

    expectText("Offer Accepted")
    expect(screen.getAllByTestId("money-fill-icon")).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    getWrapper("OFFER_ACCEPTED_CONFIRM_NEEDED", { submittedOffers: [{ internalID: "offer-1" }] })

    expectText("Offer Accepted - Confirm total")
    expect(screen.getAllByTestId("alert-fill-icon")).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    getWrapper("OFFER_RECEIVED_CONFIRM_NEEDED", { submittedOffers: [{ internalID: "offer-1" }] })

    expectText("Counteroffer Received - Confirm Total")
    expect(screen.getAllByTestId("alert-fill-icon")).toHaveLength(1)
  })

  it("shows correct message for accepted offers", () => {
    getWrapper("PROVISIONAL_OFFER_ACCEPTED", { submittedOffers: [{ internalID: "offer-1" }] })

    expectText("Offer Accepted")
    expect(screen.getAllByTestId("money-fill-icon")).toHaveLength(1)
  })

  it("shows correct message for accepted offers where payment fails", () => {
    getWrapper("PAYMENT_FAILED")

    expectText("Unable to process payment for accepted offer. Update payment method.")
    expect(screen.getAllByTestId("alert-fill-icon")).toHaveLength(1)
  })

  it("shows correct message and icon for received offers", () => {
    getWrapper("OFFER_RECEIVED", { submittedOffers: [{ internalID: "offer-1" }] })

    expectText("Offer Received")
    expect(screen.getAllByTestId("alert-fill-icon")).toHaveLength(1)
  })

  it("shows correct messaging and icon when offer is a counteroffer", () => {
    getWrapper("OFFER_RECEIVED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
    })

    expectText("Counteroffer Received")
    expect(screen.getAllByTestId("alert-fill-icon")).toHaveLength(1)
  })

  it("shows correct expiration in minutes when there is less than 1 hour left", () => {
    const expirationTime = DateTime.local().plus({ minutes: 31 })
    getWrapper("OFFER_RECEIVED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
      buyerStateExpiresAt: expirationTime.toString(),
    })

    expectText("Counteroffer Received")
    expectText("The offer expires in 30m")
  })

  it("shows correct expiration in hours when there is more than 1 hour left", () => {
    const expirationTime = DateTime.local().plus({ hours: 10 })
    getWrapper("OFFER_RECEIVED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
      buyerStateExpiresAt: expirationTime.toString(),
    })

    expectText("Counteroffer Received")
    expectText("The offer expires in 10hr")
  })

  it("shows correct expiration in hours when there is more than 24 hours left", () => {
    const expirationTime = DateTime.local().plus({ hours: 72 })
    getWrapper("OFFER_RECEIVED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
      buyerStateExpiresAt: expirationTime.toString(),
    })

    expectText("Counteroffer Received")
    expectText("The offer expires in 72hr")
  })

  it("tapping it opens the review offer webview with the correct modal title and tracks event", async () => {
    getWrapper("OFFER_RECEIVED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
    })

    // A TouchableWithoutFeedback, which only responds to responder events.
    await userEvent.press(screen.getByRole("button"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedViewOffer",
      context_owner_type: "conversation",
      impulse_conversation_id: "conversation-id",
      subject: "Counteroffer Received",
    })
    expect(navigate).toHaveBeenCalledWith("/orders/order-id/respond", {
      modal: true,
      passProps: { orderID: "order-id", title: "Respond" },
    })
  })

  it("tapping it opens the correct webview with the correct title for offers where payment fails", async () => {
    getWrapper("PAYMENT_FAILED", {
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
    })

    // A TouchableWithoutFeedback, which only responds to responder events.
    await userEvent.press(screen.getByRole("button"))

    expect(navigate).toHaveBeenCalledWith("/orders/order-id/payment/new", {
      modal: true,
      passProps: { orderID: "order-id", title: "Update Payment Details" },
    })
  })
})
