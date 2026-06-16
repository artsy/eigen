import { fireEvent, screen } from "@testing-library/react-native"
import { ConversationPartnerOfferCTA_Test_Query } from "__generated__/ConversationPartnerOfferCTA_Test_Query.graphql"
import { ConversationPartnerOfferCTA } from "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const futureISO = (minutes = 60) => new Date(Date.now() + minutes * 60 * 1000).toISOString()
const pastISO = () => new Date(Date.now() - 60 * 60 * 1000).toISOString()

const { renderWithRelay } = setupTestWrapper<ConversationPartnerOfferCTA_Test_Query>({
  Component: ({ me }) => <ConversationPartnerOfferCTA conversation={me!.conversation!} me={me!} />,
  query: graphql`
    query ConversationPartnerOfferCTA_Test_Query($conversationID: String!) @relay_test_operation {
      me {
        ...usePartnerOffer_me
        conversation(id: $conversationID) {
          ...ConversationPartnerOfferCTA_conversation
        }
      }
    }
  `,
  variables: { conversationID: "conversation-id" },
})

const offerResolvers = (
  offerOverrides: Record<string, unknown> = {},
  artworkOverrides: Record<string, unknown> = {}
) => ({
  Conversation: () => ({
    items: [
      {
        item: {
          __typename: "Artwork",
          internalID: "artwork-id",
          href: "/artwork/some-artwork",
          ...artworkOverrides,
        },
      },
    ],
  }),
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
  }),
})

describe("ConversationPartnerOfferCTA", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })
  })

  it("renders the offer banner and navigates to the artwork with the partner offer id", () => {
    renderWithRelay(offerResolvers())

    expect(screen.getByText("Offer received for $450")).toBeTruthy()

    fireEvent.press(screen.getByTestId("partnerOfferActionLink"))
    expect(navigate).toHaveBeenCalledWith("/artwork/some-artwork?partner_offer_id=partner-offer-id")
  })

  it("falls back to a generic title when there is no discounted price", () => {
    renderWithRelay(offerResolvers({ priceWithDiscount: null }))

    expect(screen.getByText("Offer received")).toBeTruthy()
  })

  it("renders nothing when there is no offer for the artwork", () => {
    renderWithRelay({
      Conversation: () => ({
        items: [{ item: { __typename: "Artwork", internalID: "artwork-id", href: "/foo" } }],
      }),
      Me: () => ({ partnerOffersConnection: { edges: [] } }),
    })

    expect(screen.queryByTestId("partnerOfferActionLink")).toBeNull()
  })

  it("renders nothing when there is no artwork href", () => {
    renderWithRelay(offerResolvers({}, { href: null }))

    expect(screen.queryByTestId("partnerOfferActionLink")).toBeNull()
  })

  it("renders nothing when the offer has expired", () => {
    renderWithRelay(offerResolvers({ endAt: pastISO() }))

    expect(screen.queryByTestId("partnerOfferActionLink")).toBeNull()
  })

  it("renders nothing when the offer is unavailable", () => {
    renderWithRelay(offerResolvers({ isAvailable: false }))

    expect(screen.queryByTestId("partnerOfferActionLink")).toBeNull()
  })

  it("renders nothing when the feature flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: false })

    renderWithRelay(offerResolvers())

    expect(screen.queryByTestId("partnerOfferActionLink")).toBeNull()
  })

  it("renders the countdown in red when the offer expires in under an hour", () => {
    renderWithRelay(offerResolvers({ endAt: futureISO(30) }))

    // red100 in the v3 (light) theme
    expect(screen.getByText(/Expires in/)).toHaveStyle({ color: "#D71023" })
  })
})
