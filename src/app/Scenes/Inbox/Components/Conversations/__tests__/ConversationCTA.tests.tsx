import { AlertFillIcon, MoneyFillIcon } from "@artsy/icons/native"
import { Color } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { ConversationCTATestsQuery } from "__generated__/ConversationCTATestsQuery.graphql"
import { CTAPopUp } from "app/Scenes/Inbox/Components/Conversations/CTAPopUp"
import { ConversationCTA } from "app/Scenes/Inbox/Components/Conversations/ConversationCTA"
import { ConversationPartnerOfferCTA } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA"
import { OpenInquiryModalButton } from "app/Scenes/Inbox/Components/Conversations/OpenInquiryModalButton"
import { ReviewOfferButton } from "app/Scenes/Inbox/Components/Conversations/ReviewOfferButton"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { ComponentType } from "react"
import { graphql } from "react-relay"

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
  expect(screen.UNSAFE_queryAllByType(ReviewOfferButton)).toHaveLength(0)
  expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton)).toHaveLength(0)
}

const expectReviewOfferButton = ({
  Icon,
  strings,
}: {
  // `bg` is still accepted by callers for readability, but the background color
  // is covered by ReviewOfferButton's own test rather than via node access here.
  bg?: Color
  Icon?: ComponentType<any>
  strings?: string[]
}) => {
  const cta = screen.UNSAFE_queryAllByType(ReviewOfferButton)[0]
  expect(cta).toBeDefined()
  if (strings) {
    const textContent = extractText(cta)
    strings.forEach((string) => {
      expect(textContent).toContain(string)
    })
  }
  if (Icon) {
    expect(screen.UNSAFE_queryAllByType(Icon)).toHaveLength(1)
  }
  return cta
}

it("renders without throwing an error", () => {
  renderWithRelay()
  expect(screen.UNSAFE_queryAllByType(ConversationCTA)).toHaveLength(1)
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

  it("renders the make offer button if there is no active order", () => {
    renderWithOrders()

    expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton)).toHaveLength(1)
  })

  describe("with an active partner offer", () => {
    const futureISO = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const partnerOfferResolvers = {
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
              },
            },
          ],
        },
      }),
      // Ensures both `items.item` and `liveArtwork` resolve to the same artwork id
      // that the offer below references.
      Artwork: () => ({ internalID: "123", href: "/artwork/foo", isOfferableFromInquiry: true }),
    }

    it("replaces the inquiry buttons with the offer banner when the flag is on", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })

      renderWithRelay(partnerOfferResolvers)

      // The dedicated offer banner replaces the inquiry transaction buttons.
      expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton)).toHaveLength(0)
      expect(screen.UNSAFE_queryAllByType(ConversationPartnerOfferCTA)).toHaveLength(1)
    })

    it("still renders the inquiry buttons when the flag is off", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: false })

      renderWithRelay(partnerOfferResolvers)

      expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton)).toHaveLength(1)
    })
  })

  it("renders the payment failed message if the payment failed", () => {
    renderWithOrders({ lastTransactionFailed: true, mode: "OFFER" })

    expectReviewOfferButton({
      bg: "red100",
      Icon: AlertFillIcon,
      strings: [
        "Payment Failed",
        "Unable to process payment for accepted offer. Update payment method.",
      ],
    })
  })

  it("doesn't render when the last offer is from a buyer and it has not been accepted or rejected by the seller", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: {
        fromParticipant: "BUYER",
      },
    })
    assertRendersNothing()
  })

  it("renders the pending offer when the last offer is from the seller", () => {
    renderWithOrders({
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
      Icon: AlertFillIcon,
    })
  })

  it("shows correct message for an offer accepted by the buyer", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "BUYER" },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: MoneyFillIcon,
    })
  })

  it("shows correct message for an offer accepted by the seller that does not define total (change amount)", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "SELLER", definesTotal: false },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: MoneyFillIcon,
    })
  })

  it("shows counter received - confirm total when offer defines total and amount changes", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: { fromParticipant: "SELLER", offerAmountChanged: true, definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Counteroffer Received", "Confirm Total"],
      Icon: AlertFillIcon,
    })
  })

  it("shows the 'approved' banner for fulfilled offers", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "FULFILLED",
      lastOffer: { fromParticipant: "BUYER" },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: MoneyFillIcon,
    })
  })

  it("shows accepted  - confirm total when offer defines total and amount stays the same", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "SUBMITTED",
      lastOffer: { fromParticipant: "SELLER", offerAmountChanged: false, definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "orange150",
      strings: ["Offer Accepted", "Confirm total"],
      Icon: AlertFillIcon,
    })
  })

  it("shows offer accepted when buyer also approves the provisional offer", () => {
    renderWithOrders({
      mode: "OFFER",
      state: "APPROVED",
      lastOffer: { fromParticipant: "SELLER", definesTotal: true },
    })

    expectReviewOfferButton({
      bg: "green100",
      strings: ["Offer Accepted"],
      Icon: MoneyFillIcon,
    })
  })

  describe("given BUY mode", () => {
    it("doesn't render anything", () => {
      renderWithOrders({
        mode: "BUY",
      })

      expect(screen.UNSAFE_queryAllByType(CTAPopUp)).toHaveLength(0)
    })
  })
})
