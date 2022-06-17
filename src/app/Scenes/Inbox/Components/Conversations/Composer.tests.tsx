import { waitFor } from "@testing-library/react-native"
import { ComposerTestsQuery } from "__generated__/ComposerTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button, Flex } from "palette"
import React from "react"
import { TextInput } from "react-native"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ComposerFragmentContainer } from "./Composer"
import { CTAPopUp } from "./CTAPopUp"
import { OpenInquiryModalButton } from "./OpenInquiryModalButton"
import { ReviewOfferButton } from "./ReviewOfferButton"

jest.unmock("react-tracking")
jest.unmock("react-relay")

let env: ReturnType<typeof createMockEnvironment>

beforeEach(() => {
  env = createMockEnvironment()
})

const TestRenderer = (nonRelayProps: { disabled: boolean; value?: string }) => (
  <QueryRenderer<ComposerTestsQuery>
    environment={env}
    query={graphql`
      query ComposerTestsQuery @relay_test_operation {
        me {
          conversation(id: "whatever") {
            ...Composer_conversation
          }
        }
      }
    `}
    variables={{}}
    render={({ props, error }) => {
      if (Boolean(props?.me?.conversation)) {
        return (
          <ComposerFragmentContainer conversation={props!.me!.conversation!} {...nonRelayProps} />
        )
      } else if (Boolean(error)) {
        console.log(error)
      }
    }}
  />
)

const defaultProps = { disabled: false }
const getWrapper = (mockResolvers = {}, nonRelayProps = {}) => {
  const tree = renderWithWrappers(<TestRenderer {...{ ...defaultProps, ...nonRelayProps }} />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
  })
  return tree
}

it("renders without throwing a error", () => {
  getWrapper()
})

describe("regarding the send button", () => {
  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = getWrapper({}, { value: overrideText, disabled: true })

    expect(tree.root.findByType(Button).props.disabled).toBeTruthy()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = getWrapper({}, { onSubmit })
    const text = "Don't trust everything you see, even salt looks like sugar"
    tree.root.findByType(TextInput).props.onChangeText(text)
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    expect(onSubmit).toBeCalledWith(text)
  })
})

describe("inquiry offer", () => {
  it("renders the inquiry make offer button if inquiry item is an offerable artwork and no active orders", () => {
    const tree = getWrapper({
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
    expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(1)
  })

  it("does not render the inquiry make offer button if inquiry item is not an offerable artwork", () => {
    const tree = getWrapper({
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
    expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(0)
  })

  it("does not render a CTA when the keyboard is visible", async () => {
    const tree = getWrapper({
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
    const input = tree.root.findByType(TextInput)

    input.props.onFocus()

    await waitFor(() => expect(tree.root.findAllByType(CTAPopUp)[0]).not.toBeDefined())
  })

  describe("with associated orders (OrderCTAs)", () => {
    it("renders no CTA if there is an active order with a pending offer from the buyer", () => {
      const tree = getWrapper({
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

      const cta = tree.root.findAllByType(CTAPopUp)[0]
      expect(cta).not.toBeDefined()
    })

    it("renders a copper offer CTA if there is a pending offer from the seller", () => {
      const tree = getWrapper({
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
      const cta = tree.root.findAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(cta.children.length).toBe(1)
      expect(extractText(cta)).toContain("Counteroffer Received")
      expect(cta.findAllByType(Flex)[0].props).toEqual(expect.objectContaining({ bg: "copper100" }))
    })

    it("renders a green cta if the seller has approved the buyer's offer", () => {
      const tree = getWrapper({
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
      const cta = tree.root.findAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(cta.children.length).toBe(1)
      expect(extractText(cta)).toContain("Counteroffer Accepted")
      expect(cta.findAllByType(Flex)[0].props).toEqual(expect.objectContaining({ bg: "green100" }))
    })

    it("renders the MO button instead of the cta if the seller has rejected the buyer's offer", () => {
      const tree = getWrapper({
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
      expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(1)
      expect(tree.root.findAllByType(ReviewOfferButton).length).toEqual(0)
    })

    it("renders a red cta if the payment fails after an order is accepted", () => {
      const tree = getWrapper({
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
      const cta = tree.root.findAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(cta.children.length).toBe(1)
      expect(extractText(cta)).toContain("Payment Failed")
      expect(cta.findAllByType(Flex)[0].props).toEqual(expect.objectContaining({ bg: "red100" }))
    })

    it("renders the MO button instead of the cta if the offer lapsed", () => {
      const tree = getWrapper({
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
      expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(1)
      expect(tree.root.findAllByType(ReviewOfferButton).length).toEqual(0)
    })
  })
})
