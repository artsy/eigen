import { screen } from "@testing-library/react-native"
import { usePartnerOfferEvent_Test_Query } from "__generated__/usePartnerOfferEvent_Test_Query.graphql"
import { ConversationPartnerOfferUpdate } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferUpdate"
import { usePartnerOfferEvent } from "app/Scenes/Inbox/hooks/usePartnerOfferEvent"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const futureISO = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()

const TestComponent = ({ conversation }: any) => {
  const event = usePartnerOfferEvent({
    conversation,
    artworkId: "artwork-id",
  })

  if (!event) {
    return null
  }

  return <ConversationPartnerOfferUpdate partnerOffer={event} />
}

const { renderWithRelay } = setupTestWrapper<usePartnerOfferEvent_Test_Query>({
  Component: ({ me }) => <TestComponent conversation={me!.conversation} />,
  query: graphql`
    query usePartnerOfferEvent_Test_Query @relay_test_operation {
      me {
        conversation(id: "conversation-id") {
          ...usePartnerOffer_conversation
        }
      }
    }
  `,
})

const activeOfferResolvers = (offerOverrides: Record<string, unknown> = {}) => ({
  Conversation: () => ({
    collectorPartnerOffersConnection: {
      edges: [
        {
          node: {
            internalID: "partner-offer-id",
            artworkId: "artwork-id",
            endAt: futureISO(),
            isAvailable: true,
            isPurchased: false,
            priceWithDiscount: { display: "$450" },
            ...offerOverrides,
          },
        },
      ],
    },
  }),
})

describe("usePartnerOfferEvent", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })
  })

  it("shows 'You purchased this artwork' when the offer has been purchased", () => {
    renderWithRelay(activeOfferResolvers({ isPurchased: true }))

    expect(screen.getByText("You purchased this artwork")).toBeTruthy()
  })

  it("shows the offer message when the offer has not been purchased", () => {
    renderWithRelay(activeOfferResolvers({ isPurchased: false }))

    expect(screen.queryByText("You purchased this artwork")).toBeNull()
    expect(screen.getByText("You received an offer for $450")).toBeTruthy()
  })
})
