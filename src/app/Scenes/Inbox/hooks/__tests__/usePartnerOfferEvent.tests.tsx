import { screen } from "@testing-library/react-native"
import { usePartnerOfferEvent_Test_Query } from "__generated__/usePartnerOfferEvent_Test_Query.graphql"
import { ConversationPartnerOfferUpdate } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { usePartnerOfferEvent } from "app/Scenes/Inbox/hooks/usePartnerOfferEvent"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const futureISO = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()

const TestComponent = ({ me }: any) => {
  const event = usePartnerOfferEvent({
    me,
    artworkId: "artwork-id",
    conversation: me.conversation,
  })

  if (!event) {
    return null
  }

  return <ConversationPartnerOfferUpdate partnerOffer={event} />
}

const { renderWithRelay } = setupTestWrapper<usePartnerOfferEvent_Test_Query>({
  Component: ({ me }) => <TestComponent me={me} />,
  query: graphql`
    query usePartnerOfferEvent_Test_Query($conversationID: String!) @relay_test_operation {
      me {
        ...usePartnerOffer_me
        conversation(id: $conversationID) {
          ...usePartnerOfferEvent_conversation
        }
      }
    }
  `,
  variables: { conversationID: "conversation-id" },
})

const activeOfferResolvers = (
  orderOverrides: Record<string, unknown> = {},
  offerOverrides: Record<string, unknown> = {}
) => ({
  Me: () => ({
    partnerOffersConnection: {
      edges: [
        {
          node: {
            internalID: "partner-offer-id",
            artworkId: "artwork-id",
            endAt: futureISO(),
            isAvailable: true,
            priceWithDiscount: { display: "$450" },
            ...offerOverrides,
          },
        },
      ],
    },
    conversation: {
      collectorOrdersConnection: {
        edges: [
          {
            node: {
              lineItems: [{ partnerOfferId: "partner-offer-id" }],
              ...orderOverrides,
            },
          },
        ],
      },
    },
  }),
})

describe("usePartnerOfferEvent", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })
  })

  it("shows 'You purchased this artwork' when the order is SUBMITTED", () => {
    renderWithRelay(activeOfferResolvers({ buyerState: "SUBMITTED" }))

    expect(screen.getByText("You purchased this artwork")).toBeTruthy()
  })

  it("shows 'You purchased this artwork' when the order is APPROVED", () => {
    renderWithRelay(activeOfferResolvers({ buyerState: "APPROVED" }))

    expect(screen.getByText("You purchased this artwork")).toBeTruthy()
  })

  it("shows 'You purchased this artwork' when the order is COMPLETED", () => {
    renderWithRelay(activeOfferResolvers({ buyerState: "COMPLETED" }))

    expect(screen.getByText("You purchased this artwork")).toBeTruthy()
  })

  it.each(["INCOMPLETE", "CANCELED"])(
    "does not show 'You purchased this artwork' when the order has buyerState %s",
    (buyerState) => {
      renderWithRelay(activeOfferResolvers({ buyerState }))

      expect(screen.queryByText("You purchased this artwork")).toBeNull()
      expect(screen.getByText("You received an offer for $450")).toBeTruthy()
    }
  )
})
