import { Button } from "@artsy/palette-mobile"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ComposerTestsQuery } from "__generated__/ComposerTestsQuery.graphql"
import { CTAPopUp } from "app/Scenes/Inbox/Components/Conversations/CTAPopUp"
import { Composer } from "app/Scenes/Inbox/Components/Conversations/Composer"
import { OpenInquiryModalButton } from "app/Scenes/Inbox/Components/Conversations/OpenInquiryModalButton"
import { ReviewOfferButton } from "app/Scenes/Inbox/Components/Conversations/ReviewOfferButton"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { TextInput, TouchableWithoutFeedback } from "react-native"
import { graphql } from "react-relay"

jest.unmock("react-tracking")

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

    expect(screen.UNSAFE_getByType(Button).props.disabled).toBeTruthy()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    renderWithRelay({}, { onSubmit })

    const text = "Don't trust everything you see, even salt looks like sugar"
    act(() => {
      screen.UNSAFE_getByType(TextInput).props.onChangeText(text)
    })

    fireEvent(screen.UNSAFE_getByType(TouchableWithoutFeedback), "onPress")

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
        activeOrders: { edges: [] },
      }),
    })
    expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton).length).toEqual(1)
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
              isOfferableFromInquiry: true,
              __typename: "Artwork",
              internalID: "123",
            },
          },
        ],
      }),
    })
    expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton).length).toEqual(0)
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
        activeOrders: { edges: [] },
      }),
    })

    act(() => {
      screen.UNSAFE_getByType(TextInput).props.onFocus()
    })

    await waitFor(() => expect(screen.UNSAFE_queryAllByType(CTAPopUp)[0]).not.toBeDefined())
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
          activeOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "SUBMITTED",
                  lastOffer: {
                    fromParticipant: "BUYER",
                  },
                },
              },
            ],
          },
        }),
      })

      expect(screen.UNSAFE_queryAllByType(CTAPopUp)[0]).not.toBeDefined()
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
          activeOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "SUBMITTED",
                  lastOffer: {
                    fromParticipant: "SELLER",
                    offerAmountChanged: true,
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
      const cta = screen.UNSAFE_queryAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(extractText(cta)).toContain("Counteroffer Received")
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
          activeOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "APPROVED",
                  lastOffer: {
                    fromParticipant: "BUYER",
                  },
                  offers: {
                    // plural offers => counteroffer
                    edges: [{}, {}],
                  },
                },
              },
            ],
          },
        }),
      })
      const cta = screen.UNSAFE_queryAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(extractText(cta)).toContain("Counteroffer Accepted")
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
          activeOrders: { edges: [] },
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
      expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton).length).toEqual(1)
      expect(screen.UNSAFE_queryAllByType(ReviewOfferButton).length).toEqual(0)
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
          activeOrders: {
            edges: [
              {
                node: {
                  mode: "OFFER",
                  state: "SUBMITTED",
                  lastTransactionFailed: true,
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
      const cta = screen.UNSAFE_queryAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(extractText(cta)).toContain("Payment Failed")
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
          activeOrders: { edges: [] },
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
      expect(screen.UNSAFE_queryAllByType(OpenInquiryModalButton).length).toEqual(1)
      expect(screen.UNSAFE_queryAllByType(ReviewOfferButton).length).toEqual(0)
    })
  })
})
