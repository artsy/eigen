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

it("renders without throwing an error", async () => {
  await expect(renderWithRelay()).resolves.not.toThrow()
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
  const renderWithOrders = (...orders: any[]) => {
    return renderWithRelay({
      Conversation: () => ({
        ...artworkItem,
        activeOrders: {
          edges: orders.map((order) => ({ node: order })),
        },
      }),
    })
  }

  it("renders the make offer button if there is no active order", async () => {
    await renderWithOrders()

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
          activeOrders: { edges: [] },
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

      it("replaces the inquiry buttons with the offer banner when the flag is on", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })

        await renderWithRelay(buildPartnerOfferResolvers())

        // The dedicated offer banner replaces the inquiry transaction buttons.
        expect(screen.queryByText(INQUIRY_BUTTON_TEXT)).not.toBeOnTheScreen()
        expect(screen.getByTestId("conversation-partner-offer-cta")).toBeOnTheScreen()
      })

      it("still renders the inquiry buttons when the flag is off", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: false })

        await renderWithRelay(buildPartnerOfferResolvers())

        expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      })

      it("falls back to the inquiry buttons once the offer expires", async () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })

        await renderWithRelay(buildPartnerOfferResolvers({ endAt: pastISO() }))

        expect(screen.queryByTestId("conversation-partner-offer-cta")).not.toBeOnTheScreen()
        expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      })
    }
  )

  it("renders the payment failed message if the payment failed", async () => {
    await renderWithOrders({ lastTransactionFailed: true, mode: "OFFER" })

    expectReviewOfferButton({
      bg: "red100",
      Icon: "alert-fill-icon",
      strings: [
        "Payment Failed",
        "Unable to process payment for accepted offer. Update payment method.",
      ],
    })
  })

  it("doesn't render when the last offer is from a buyer and it has not been accepted or rejected by the seller", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: {
        fromParticipant: "BUYER",
      },
    })
    assertRendersNothing()
  })

  it("renders the pending offer when the last offer is from the seller", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: {
        fromParticipant: "SELLER",
        offerAmountChanged: true,
      },
    })
    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Offer Received"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows correct message for an offer accepted by the buyer", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "BUYER" },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  it("shows correct message for an offer accepted by the seller that does not define total (change amount)", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "SELLER", definesTotal: false },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  it("shows counter received - confirm total when offer defines total and amount changes", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: { fromParticipant: "SELLER", offerAmountChanged: true, definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Counteroffer Received", "Confirm Total"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows the 'approved' banner for fulfilled offers", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "FULFILLED",
      lastOffer: { fromParticipant: "BUYER" },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  it("shows accepted  - confirm total when offer defines total and amount stays the same", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: { fromParticipant: "SELLER", offerAmountChanged: false, definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Offer Accepted", "Confirm total"],
      Icon: "alert-fill-icon",
    })
  })

  it("shows offer accepted when buyer also approves the provisional offer", async () => {
    await renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "SELLER", definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: "money-fill-icon",
    })
  })

  describe("given BUY mode", () => {
    it("doesn't render anything", async () => {
      await renderWithOrders({
        mode: "BUY",
      })

      expect(screen.queryByTestId("cta-pop-up")).not.toBeOnTheScreen()
    })
  })
})
