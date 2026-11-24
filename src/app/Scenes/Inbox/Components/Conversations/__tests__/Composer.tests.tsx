import { fireEvent, screen, userEvent, waitFor } from "@testing-library/react-native"
import { ComposerTestsQuery } from "__generated__/ComposerTestsQuery.graphql"
import { Composer } from "app/Scenes/Inbox/Components/Conversations/Composer"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.unmock("react-tracking")

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

// Copy only OpenInquiryModalButton renders.
const INQUIRY_BUTTON_TEXT = "The Artsy Guarantee"

const { renderWithRelay } = setupTestWrapper<
  ComposerTestsQuery,
  { disabled?: boolean; value?: string; onSubmit?: (text: string) => void }
>({
  Component: ({ me, ...props }) => <Composer conversation={me!.conversation!} {...props} />,
  query: graphql`
    query ComposerTestsQuery @relay_test_operation {
      me {
        conversation(id: "whatever") {
          ...Composer_conversation
        }
      }
    }
  `,
})

it("renders without throwing a error", () => {
  renderWithRelay()
})

describe("regarding the send button", () => {
  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    renderWithRelay({}, { value: overrideText, disabled: true })

    expect(screen.getByText("Send")).toBeDisabled()
  })

  it("calls onSubmit with the text when send button is pressed", async () => {
    const onSubmit = jest.fn()
    renderWithRelay({}, { onSubmit })

    const text = "Don't trust everything you see, even salt looks like sugar"
    fireEvent.changeText(screen.getByLabelText("Text input field"), text)

    // The send button is a TouchableWithoutFeedback, which only responds to responder events.
    await userEvent.press(screen.getByText("Send"))

    expect(onSubmit).toHaveBeenCalledWith(text)
  })
})

describe("inquiry offer", () => {
  it("renders the inquiry make offer button if inquiry item is an offerable artwork and no active orders", () => {
    renderWithRelay({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Artwork",
            },
            liveArtwork: {
              isOfferableFromInquiry: true,
              __typename: "Artwork",
              internalID: "123",
            },
          },
        ],
        activeCollectorOrders: { edges: [] },
      }),
    })
    expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
  })

  it("does not render the inquiry make offer button if inquiry item is not an offerable artwork", () => {
    renderWithRelay({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Artwork",
            },
            liveArtwork: {
              isOfferableFromInquiry: false,
              isOfferable: false,
              isAcquireable: false,
              __typename: "Artwork",
              internalID: "123",
            },
          },
        ],
        activeCollectorOrders: { edges: [] },
      }),
    })
    expect(screen.queryByText(INQUIRY_BUTTON_TEXT)).not.toBeOnTheScreen()
  })

  it("does not render a CTA when the keyboard is visible", async () => {
    renderWithRelay({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Artwork",
            },
          },
        ],
        activeCollectorOrders: { edges: [] },
      }),
    })

    fireEvent(screen.getByLabelText("Text input field"), "focus")

    await waitFor(() => expect(screen.queryByTestId("cta-pop-up")).not.toBeOnTheScreen())
  })

  describe("with associated orders (OrderCTAs)", () => {
    it("renders no CTA if there is an active order with a pending offer from the buyer", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
            },
          ],
          internalID: "conversation-id",
          activeCollectorOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  buyerState: "SUBMITTED",
                  buyerAction: null,
                  impulseConversationId: "conversation-id",
                },
              },
            ],
          },
        }),
      })

      expect(screen.queryByTestId("cta-pop-up")).not.toBeOnTheScreen()
    })

    it("renders a orange offer CTA if there is a pending offer from the seller", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
              liveArtwork: {
                isOfferableFromInquiry: true,
                __typename: "Artwork",
                internalID: "123",
              },
            },
          ],
          internalID: "conversation-id",
          activeCollectorOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  buyerState: "OFFER_RECEIVED",
                  buyerAction: "OFFER_RECEIVED",
                  impulseConversationId: "conversation-id",
                  submittedOffers: [{}, {}],
                },
              },
            ],
          },
        }),
      })
      expect(screen.getByTestId("review-offer-button")).toHaveTextContent(/Counteroffer Received/)
    })

    it("renders a green cta if the seller has approved the buyer's offer", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
              liveArtwork: {
                isOfferableFromInquiry: true,
                __typename: "Artwork",
                internalID: "123",
              },
            },
          ],
          internalID: "conversation-id",
          activeCollectorOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  buyerState: "APPROVED",
                  buyerAction: "OFFER_ACCEPTED",
                  impulseConversationId: "conversation-id",
                  // plural offers => counteroffer
                  submittedOffers: [{}, {}],
                },
              },
            ],
          },
        }),
      })
      expect(screen.getByTestId("review-offer-button")).toHaveTextContent(/Counteroffer Accepted/)
    })

    it("renders the MO button instead of the cta if the seller has rejected the buyer's offer", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
              liveArtwork: {
                isOfferableFromInquiry: true,
                __typename: "Artwork",
                internalID: "123",
              },
            },
          ],
          activeCollectorOrders: { edges: [] },
          orderConnection: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "CANCELED",
                  stateReason: "seller_rejected",
                  lastOffer: {
                    fromParticipant: "BUYER",
                  },
                  offers: {
                    edges: [{}],
                  },
                },
              },
            ],
          },
        }),
      })
      expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      expect(screen.queryByTestId("review-offer-button")).not.toBeOnTheScreen()
    })

    it("renders a red cta if the payment fails after an order is accepted", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
              liveArtwork: {
                isOfferableFromInquiry: true,
                __typename: "Artwork",
                internalID: "123",
              },
            },
          ],
          internalID: "conversation-id",
          activeCollectorOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  buyerState: "PAYMENT_FAILED",
                  buyerAction: "PAYMENT_FAILED",
                  impulseConversationId: "conversation-id",
                  submittedOffers: [{}],
                },
              },
            ],
          },
        }),
      })
      expect(screen.getByTestId("review-offer-button")).toHaveTextContent(/Payment Failed/)
    })

    it("renders the MO button instead of the cta if the offer lapsed", () => {
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
              },
              liveArtwork: {
                isOfferableFromInquiry: true,
                __typename: "Artwork",
                internalID: "123",
              },
            },
          ],
          activeCollectorOrders: { edges: [] },
          orderConnection: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "CANCELED",
                  stateReason: "buyer_lapsed",
                  lastOffer: {
                    fromParticipant: "SELLER",
                  },
                  offers: {
                    edges: [{}, {}],
                  },
                },
              },
            ],
          },
        }),
      })
      expect(screen.getByText(INQUIRY_BUTTON_TEXT)).toBeOnTheScreen()
      expect(screen.queryByTestId("review-offer-button")).not.toBeOnTheScreen()
    })
  })
})
