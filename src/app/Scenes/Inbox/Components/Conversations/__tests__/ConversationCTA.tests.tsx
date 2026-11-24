import { Color } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { ConversationCTATestsQuery } from "__generated__/ConversationCTATestsQuery.graphql"
import { ConversationCTA } from "app/Scenes/Inbox/Components/Conversations/ConversationCTA"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Wrap the CTA pieces in host views we can query, so the tests can tell which ones rendered.
jest.mock("app/Scenes/Inbox/Components/Conversations/CTAPopUp", () => {
  const { View } = require("react-native")
  const actual = jest.requireActual("app/Scenes/Inbox/Components/Conversations/CTAPopUp")

  return {
    ...actual,
    CTAPopUp: (props: any) => (
      <View testID="cta-pop-up">
        <actual.CTAPopUp {...props} />
      </View>
    ),
  }
})

jest.mock("app/Scenes/Inbox/Components/Conversations/ReviewOfferButton", () => {
  const { View } = require("react-native")
  const actual = jest.requireActual("app/Scenes/Inbox/Components/Conversations/ReviewOfferButton")

  return {
    ...actual,
    ReviewOfferButton: (props: any) => (
      <View testID="review-offer-button">
        <actual.ReviewOfferButton {...props} />
      </View>
    ),
  }
})

jest.mock("app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA", () => {
  const { View } = require("react-native")
  const actual = jest.requireActual(
    "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA"
  )

  return {
    ...actual,
    ConversationPartnerOfferCTA: (props: any) => (
      <View testID="conversation-partner-offer-cta">
        <actual.ConversationPartnerOfferCTA {...props} />
      </View>
    ),
  }
})

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

const CONVERSATION_ID = "conversation-id"

// Copy only OpenInquiryModalButton renders.
const INQUIRY_BUTTON_TEXT = "The Artsy Guarantee"

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const { renderWithRelay } = setupTestWrapper<ConversationCTATestsQuery>({
  Component: ({ me }) => <ConversationCTA show conversation={me!.conversation!} />,
  query: graphql`
    query ConversationCTATestsQuery($conversationID: String!) @relay_test_operation {
      me {
        conversation(id: $conversationID) {
          ...ConversationCTA_conversation
        }
      }
    }
  `,
  variables: { conversationID: "test-conversation" },
})

const assertRendersNothing = () => {
  expect(screen.queryByTestId("review-offer-button")).not.toBeOnTheScreen()
  expect(screen.queryByText(INQUIRY_BUTTON_TEXT)).not.toBeOnTheScreen()
}

const expectReviewOfferButton = ({
  Icon,
  strings,
}: {
  // `bg` is still accepted by callers for readability, but the background color
  // is covered by ReviewOfferButton's own test rather than via node access here.
  bg?: Color
  Icon?: "alert-fill-icon" | "money-fill-icon"
  strings?: string[]
}) => {
  const cta = screen.getByTestId("review-offer-button")
  if (strings) {
    strings.forEach((string) => {
      expect(cta).toHaveTextContent(new RegExp(escapeRegExp(string)))
    })
  }
  if (Icon) {
    expect(screen.getAllByTestId(Icon)).toHaveLength(1)
  }
  return cta
}

it("renders without throwing an error", () => {
  expect(() => renderWithRelay()).not.toThrow()
})

describe("conversation about an artwork with inquiry checkout enabled", () => {
  const artworkItem = {
    items: [
      {
        item: {
          __typename: "Artwork",
          internalID: "123",
        },
        liveArtwork: {
          isOfferableFromInquiry: true,
          __typename: "Artwork",
          internalID: "123",
        },
      },
    ],
  }
  // Orders from this conversation unless a test says otherwise. Pass `null` for a
  // null node (an order whose artwork was deleted).
  const offerOrder = (overrides: Record<string, unknown> = {}) => ({
    internalID: "order-id",
    mode: "OFFER",
    buyerAction: null,
    buyerState: "SUBMITTED",
    impulseConversationId: CONVERSATION_ID,
    ...overrides,
  })

  const renderWithOrders = (...orders: any[]) => {
    return renderWithRelay({
      Conversation: () => ({
        ...artworkItem,
        internalID: CONVERSATION_ID,
        activeCollectorOrders: {
          edges: orders.map((order) => ({ node: order === null ? null : offerOrder(order) })),
        },
      }),
    })
  }

  it("renders the make offer button if there is no active order", () => {
    renderWithOrders()

    expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
  })

  // The `partnerOffersConnection` query fetches both `BULK` (sent via the
  // partner dashboard's send-offer tool) and `PERSONALIZED` offer types.
  // Eigen can't distinguish between the two once fetched, so both should
  // behave identically here.
  describe.each([["a personalized partner offer"], ["a bulk offer (send offer)"]])(
    "with %s",
    () => {
      const futureISO = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()
      const pastISO = () => new Date(Date.now() - 60 * 60 * 1000).toISOString()

      const buildPartnerOfferResolvers = (offerOverrides: Record<string, unknown> = {}) => ({
        Conversation: () => ({
          items: [{ item: { __typename: "Artwork" }, liveArtwork: { __typename: "Artwork" } }],
          activeCollectorOrders: { edges: [] },
          collectorPartnerOffersConnection: {
            edges: [
              {
                node: {
                  internalID: "partner-offer-id",
                  artworkId: "123",
                  endAt: futureISO(),
                  isAvailable: true,
                  priceWithDiscount: { display: "US$450" },
                  ...offerOverrides,
                },
              },
            ],
          },
        }),
        // Ensures both `items.item` and `liveArtwork` resolve to the same artwork id
        // that the offer below references.
        Artwork: () => ({ internalID: "123", href: "/artwork/foo", isOfferableFromInquiry: true }),
      })

      it("replaces the inquiry buttons with the offer banner when the flag is on", () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })

        renderWithRelay(buildPartnerOfferResolvers())

        // The dedicated offer banner replaces the inquiry transaction buttons.
        expect(screen.queryByText(INQUIRY_BUTTON_TEXT)).not.toBeOnTheScreen()
        expect(screen.getByTestId("conversation-partner-offer-cta")).toBeOnTheScreen()
      })

      it("still renders the inquiry buttons when the flag is off", () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: false })

        renderWithRelay(buildPartnerOfferResolvers())

        expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      })

      it("falls back to the inquiry buttons once the offer expires", () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })

        renderWithRelay(buildPartnerOfferResolvers({ endAt: pastISO() }))

        expect(screen.queryByTestId("conversation-partner-offer-cta")).not.toBeOnTheScreen()
        expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      })
    }
  )

  it("renders the payment failed message if the payment failed", () => {
    renderWithOrders({ buyerAction: "PAYMENT_FAILED", buyerState: "PAYMENT_FAILED" })

    expectReviewOfferButton({
      bg: "red100",
      Icon: "alert-fill-icon",
      strings: [
        "Payment Failed",
        "Unable to process payment for accepted offer. Update payment method.",
      ],
    })
  })

  it("doesn't render when the order has no buyer action (offer waiting on the seller)", () => {
    renderWithOrders({ buyerAction: null, buyerState: "SUBMITTED" })

    assertRendersNothing()
  })

  it("renders the pending offer when the seller countered", () => {
    renderWithOrders({ buyerAction: "OFFER_RECEIVED", buyerState: "OFFER_RECEIVED" })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Offer Received"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows counteroffer received when there is more than one submitted offer", () => {
    renderWithOrders({
      buyerAction: "OFFER_RECEIVED",
      buyerState: "OFFER_RECEIVED",
      submittedOffers: [{ internalID: "offer-1" }, { internalID: "offer-2" }],
    })

    expectReviewOfferButton({ strings: ["Counteroffer Received"] })
  })

  it("shows correct message for an accepted offer", () => {
    renderWithOrders({ buyerAction: "OFFER_ACCEPTED", buyerState: "APPROVED" })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  it("shows counter received - confirm total when the seller's counteroffer defines the total", () => {
    renderWithOrders({
      buyerAction: "OFFER_RECEIVED_CONFIRM_NEEDED",
      buyerState: "OFFER_RECEIVED",
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Counteroffer Received", "Confirm Total"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows accepted - confirm total when the seller accepts and defines the total", () => {
    renderWithOrders({
      buyerAction: "OFFER_ACCEPTED_CONFIRM_NEEDED",
      buyerState: "OFFER_RECEIVED",
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Offer Accepted", "Confirm total"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows offer accepted when buyer also approves the provisional offer", () => {
    renderWithOrders({ buyerAction: "PROVISIONAL_OFFER_ACCEPTED", buyerState: "APPROVED" })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  // Exchange returns no buyer action once an order is fulfilled, but the app has
  // always kept showing the accepted banner.
  it.each([["SHIPPED"], ["COMPLETED"]])(
    "shows the 'approved' banner for fulfilled (%s) offers",
    (buyerState) => {
      renderWithOrders({ buyerAction: null, buyerState })

      expectReviewOfferButton({
        bg: "green100",
        strings: ["Offer Accepted"],
        Icon: "money-fill-icon",
      })
    }
  )

  it("doesn't render for refunded offers", () => {
    renderWithOrders({ buyerAction: null, buyerState: "REFUNDED" })

    assertRendersNothing()
  })

  it("ignores orders from another conversation and shows the inquiry buttons", () => {
    renderWithOrders({
      buyerAction: "OFFER_RECEIVED",
      buyerState: "OFFER_RECEIVED",
      impulseConversationId: "another-conversation-id",
    })

    expect(screen.queryByTestId("review-offer-button")).not.toBeOnTheScreen()
    expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
  })

  it("ignores orders with no conversation and shows the inquiry buttons", () => {
    renderWithOrders({
      buyerAction: "OFFER_RECEIVED",
      buyerState: "OFFER_RECEIVED",
      impulseConversationId: null,
    })

    expect(screen.queryByTestId("review-offer-button")).not.toBeOnTheScreen()
    expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
  })

  it("skips null order nodes", () => {
    renderWithOrders(null, { buyerAction: "OFFER_RECEIVED", buyerState: "OFFER_RECEIVED" })

    expectReviewOfferButton({ strings: ["Offer Received"] })
  })

  it("shows the inquiry buttons when the only node is null", () => {
    renderWithOrders(null)

    expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
  })

  it("prefers the order with a buyer action over a newer order without one", () => {
    renderWithOrders(
      { internalID: "newer-order-id", buyerAction: null, buyerState: "SUBMITTED" },
      {
        internalID: "countered-order-id",
        buyerAction: "OFFER_RECEIVED",
        buyerState: "OFFER_RECEIVED",
      }
    )

    expectReviewOfferButton({ strings: ["Offer Received"] })
  })

  describe("given BUY mode", () => {
    it("doesn't render anything", () => {
      renderWithOrders({
        mode: "BUY",
        buyerAction: null,
        buyerState: "APPROVED",
      })

      expect(screen.queryByTestId("cta-pop-up")).not.toBeOnTheScreen()
    })
  })
})
