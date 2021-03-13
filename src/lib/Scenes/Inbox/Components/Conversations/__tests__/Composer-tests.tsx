import { ComposerTestsQuery } from "__generated__/ComposerTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Flex } from "palette"
import React from "react"
import { TextInput } from "react-native"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ComposerFragmentContainer } from "../Composer"
import { OpenInquiryModalButton } from "../OpenInquiryModalButton"
import { ReviewOfferButton } from "../ReviewOfferButton"

jest.unmock("react-tracking")
jest.unmock("react-relay")

// jest.mock("../ReviewOfferButton", () => {
//   console.log("im mockin")
//   return {
//     ReviewOfferButtonFragmentContainer: () => "<ReviewOfferButtonMock />",
//   }
// })

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
        return <ComposerFragmentContainer conversation={props!.me!.conversation!} {...nonRelayProps} />
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
    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
  })
  return tree
}

it("renders without throwing a error", () => {
  getWrapper()
  // renderWithWrappers(<ComposerFragmentContainer disabled={false} />)
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

it("doesn't render the inquiry make offer button if the feature is disabled", () => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: false })
  const tree = getWrapper({
    Conversation: () => ({
      items: [
        {
          item: {
            __typename: "Artwork",
            isOfferableFromInquiry: true,
          },
        },
      ],
    }),
  })
  expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(0) // submit button only
})

describe("inquiry offer enabled", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: true })
  })

  it("renders the inquiry make offer button if inquiry item is an offerable artwork", () => {
    const tree = getWrapper({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Artwork",
              isOfferableFromInquiry: true,
            },
          },
        ],
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
              isOfferableFromInquiry: false,
            },
          },
        ],
      }),
    })
    expect(tree.root.findAllByType(OpenInquiryModalButton).length).toEqual(0)
  })

  describe("with associated orders", () => {
    it("renders an empty CTA if there is an active order with a pending offer from the buyer", () => {
      const tree = getWrapper({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
                isOfferableFromInquiry: true,
              },
            },
          ],
          orderConnection: {
            edges: [
              {
                node: {
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
      const cta = tree.root.findAllByType(ReviewOfferButton)[0]
      expect(cta).toBeDefined()
      expect(cta.children).toEqual([])
      expect(extractText(cta)).toEqual("")
    })

    it("renders a copper offer CTA if there is a pending offer from the seller", () => {
      const tree = getWrapper({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Artwork",
                isOfferableFromInquiry: true,
              },
            },
          ],
          orderConnection: {
            edges: [
              {
                node: {
                  state: "SUBMITTED",
                  lastOffer: {
                    fromParticipant: "SELLER",
                  },
                  offers: {
                    edges: [{ node: { internalID: 1 } }, { node: { internalID: 2 } }],
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
  })
})
