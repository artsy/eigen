import { ConversationCTATestsQuery } from "__generated__/ConversationCTATestsQuery.graphql"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { AlertCircleFillIcon } from "palette"
import { MoneyFillIcon } from "palette/svgs/MoneyFillIcon"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ConversationCTA, ConversationCTAFragmentContainer } from "../ConversationCTA"
import { OpenInquiryModalButton } from "../OpenInquiryModalButton"
jest.unmock("react-relay")

describe("ConversationCTA", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  beforeEach(() => {
    env = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  const TestRenderer = ({ showCTA = true }: { showCTA?: boolean }) => (
    <QueryRenderer<ConversationCTATestsQuery>
      environment={env}
      query={graphql`
        query ConversationCTATestsQuery($conversationID: String!) @relay_test_operation {
          me {
            conversation(id: $conversationID) {
              ...ConversationCTA_conversation
            }
          }
        }
      `}
      variables={{ conversationID: "test-conversation" }}
      render={({ error, props }) => {
        if (props?.me?.conversation) {
          return <ConversationCTAFragmentContainer show={showCTA} conversation={props.me.conversation} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )
  const assertRendersNothing = (wrapper: ReturnType<typeof getWrapper>) => {
    expect(extractText(wrapper.root)).toEqual("")
  }

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ConversationCTA)).toHaveLength(1)
  })

  describe("conversation about an artwork with inquiry checkout enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: true })
    })
    const artworkItem = {
      items: [{ item: { __typename: "Artwork", isOfferableFromInquiry: true } }],
    }
    const getWrapperWithOrders = (...orders: any[]) => {
      return getWrapper({
        Conversation: () => ({
          ...artworkItem,
          activeOrders: {
            edges: orders.map((order) => ({ node: order })),
          },
        }),
      })
    }

    it("doesn't render anything for rejected offers", () => {
      const wrapper = getWrapperWithOrders({
        state: "CANCELED",
        stateReason: "seller_rejected",
      })
      assertRendersNothing(wrapper)
    })

    it("renders the make offer button if there is no active order", () => {
      const wrapper = getWrapperWithOrders()

      expect(wrapper.root.findAllByType(OpenInquiryModalButton)).toHaveLength(1)
    })

    it("renders the payment failed message if the payment failed", () => {
      const wrapper = getWrapperWithOrders({ lastTransactionFailed: true })

      const text = extractText(wrapper.root)
      expect(text).toContain("Payment Failed")
      expect(text).toContain("Please update payment method")
      expect(wrapper.root.findAllByType(MoneyFillIcon)).toHaveLength(0)
    })

    fit("doesn't render when the last offer is from a buyer and it has not been accepted or rejected by the seller", () => {
      const wrapper = getWrapperWithOrders({
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "BUYER",
        },
      })
      assertRendersNothing(wrapper)
    })

    fit("renders the pending counteroffer when the last offer is from the seller", () => {
      const wrapper = getWrapperWithOrders({
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "SELLER",
        },
      })
      const text = extractText(wrapper.root)
      expect(text).toContain("Offer Received")
    })

    fit("shows correct message for accepted offers", () => {
      const wrapper = getWrapperWithOrders({
        state: "APPROVED",
        lastOffer: { fromParticipant: "BUYER" },
      })

      const text = extractText(wrapper.root)
      expect(text).toContain("Offer Accepted")
    })

    it("shows correct message and icon for received counteroffers", () => {
      const wrapper = getWrapper({
        CommerceOrder: () => ({
          state: "SUBMITTED",
          lastOffer: {
            fromParticipant: "SELLER",
          },
        }),
      })

      const text = extractText(wrapper.root)
      expect(text).toContain("Offer Received")
      expect(wrapper.root.findAllByType(AlertCircleFillIcon)).toHaveLength(1)
    })
  })
})
