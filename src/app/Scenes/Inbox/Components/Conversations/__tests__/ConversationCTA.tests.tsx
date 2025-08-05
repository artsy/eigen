import { AlertFillIcon, MoneyFillIcon } from "@artsy/icons/native"
import { Flex, Color } from "@artsy/palette-mobile"
import { ConversationCTATestsQuery } from "__generated__/ConversationCTATestsQuery.graphql"
import { CTAPopUp } from "app/Scenes/Inbox/Components/Conversations/CTAPopUp"
import {
  ConversationCTA,
  ConversationCTAFragmentContainer,
} from "app/Scenes/Inbox/Components/Conversations/ConversationCTA"
import { OpenInquiryModalButton } from "app/Scenes/Inbox/Components/Conversations/OpenInquiryModalButton"
import { ReviewOfferButton } from "app/Scenes/Inbox/Components/Conversations/ReviewOfferButton"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { ElementType } from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ConversationCTA", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
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
          return (
            <ConversationCTAFragmentContainer show={showCTA} conversation={props.me.conversation} />
          )
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )
  const assertRendersNothing = (wrapper: ReturnType<typeof getWrapper>) => {
    expect(extractText(wrapper.root)).toEqual("")
  }

  const expectReviewOfferButton = (
    wrapper: ReactTestRenderer,
    { bg, Icon, strings }: { bg?: Color; Icon?: ElementType<any>; strings?: string[] }
  ) => {
    const cta = wrapper.root.findAllByType(ReviewOfferButton)[0]
    expect(cta).toBeDefined()
    if (bg) {
      expect(cta.findAllByType(Flex)[0].props).toEqual(expect.objectContaining({ bg }))
    }
    if (strings) {
      const textContent = extractText(cta)
      strings.forEach((string) => {
        expect(textContent).toContain(string)
      })
    }
    if (Icon) {
      expect(wrapper.root.findAllByType(Icon)).toHaveLength(1)
    }
    return cta
  }

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ConversationCTA)).toHaveLength(1)
  })

  describe("conversation about an artwork with inquiry checkout enabled", () => {
    const artworkItem = {
      items: [
        {
          item: {
            __typename: "Artwork",
            //  isOfferableFromInquiry: true
          },
          liveArtwork: {
            isOfferableFromInquiry: true,
            __typename: "Artwork",
            internalID: "123",
          },
        },
      ],
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

    it("renders the make offer button if there is no active order", () => {
      const wrapper = getWrapperWithOrders()

      expect(wrapper.root.findAllByType(OpenInquiryModalButton)).toHaveLength(1)
    })

    it("renders the payment failed message if the payment failed", () => {
      const wrapper = getWrapperWithOrders({ lastTransactionFailed: true, mode: "OFFER" })

      expectReviewOfferButton(wrapper, {
        bg: "red100",
        Icon: AlertFillIcon,
        strings: [
          "Payment Failed",
          "Unable to process payment for accepted offer. Update payment method.",
        ],
      })
    })

    it("doesn't render when the last offer is from a buyer and it has not been accepted or rejected by the seller", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "BUYER",
        },
      })
      assertRendersNothing(wrapper)
    })

    it("renders the pending offer when the last offer is from the seller", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "SUBMITTED",
        lastOffer: {
          fromParticipant: "SELLER",
          offerAmountChanged: true,
        },
      })
      expectReviewOfferButton(wrapper, {
        bg: "orange150",
        strings: ["Offer Received"],
        Icon: AlertFillIcon,
      })
    })

    it("shows correct message for an offer accepted by the buyer", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "APPROVED",
        lastOffer: { fromParticipant: "BUYER" },
      })

      expectReviewOfferButton(wrapper, {
        bg: "green100",
        strings: ["Offer Accepted"],
        Icon: MoneyFillIcon,
      })
    })

    it("shows correct message for an offer accepted by the seller that does not define total (change amount)", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "APPROVED",
        lastOffer: { fromParticipant: "SELLER", definesTotal: false },
      })

      expectReviewOfferButton(wrapper, {
        bg: "green100",
        strings: ["Offer Accepted"],
        Icon: MoneyFillIcon,
      })
    })

    it("shows counter received - confirm total when offer defines total and amount changes", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "SUBMITTED",
        lastOffer: { fromParticipant: "SELLER", offerAmountChanged: true, definesTotal: true },
      })

      expectReviewOfferButton(wrapper, {
        bg: "orange150",
        strings: ["Counteroffer Received", "Confirm Total"],
        Icon: AlertFillIcon,
      })
    })

    it("shows the 'approved' banner for fulfilled offers", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "FULFILLED",
        lastOffer: { fromParticipant: "BUYER" },
      })

      expectReviewOfferButton(wrapper, {
        bg: "green100",
        strings: ["Offer Accepted"],
        Icon: MoneyFillIcon,
      })
    })

    it("shows accepted  - confirm total when offer defines total and amount stays the same", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "SUBMITTED",
        lastOffer: { fromParticipant: "SELLER", offerAmountChanged: false, definesTotal: true },
      })

      expectReviewOfferButton(wrapper, {
        bg: "orange150",
        strings: ["Offer Accepted", "Confirm total"],
        Icon: AlertFillIcon,
      })
    })

    it("shows offer accepted when buyer also approves the provisional offer", () => {
      const wrapper = getWrapperWithOrders({
        mode: "OFFER",
        state: "APPROVED",
        lastOffer: { fromParticipant: "SELLER", definesTotal: true },
      })

      expectReviewOfferButton(wrapper, {
        bg: "green100",
        strings: ["Offer Accepted"],
        Icon: MoneyFillIcon,
      })
    })

    describe("given BUY mode", () => {
      it("doesn't render anything", () => {
        const wrapper = getWrapperWithOrders({
          mode: "BUY",
        })

        expect(wrapper.root.findAllByType(CTAPopUp)).toHaveLength(0)
      })
    })
  })
})
