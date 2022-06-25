import { fireEvent } from "@testing-library/react-native"
import { OpenInquiryModalButtonTestQuery } from "__generated__/OpenInquiryModalButtonTestQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import relay, { QueryRenderer } from "react-relay"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { OpenInquiryModalButtonFragmentContainer } from "./OpenInquiryModalButton"

const trackEvent = useTracking().trackEvent

jest.unmock("react-relay")

const tappedMakeOfferEvent = {
  action: "tappedMakeOffer",
  context_owner_type: "conversation",
  impulse_conversation_id: "123",
}

const tappedPurchaseEvent = {
  action: "tappedBuyNow",
  context_owner_id: "fancy-art",
  context_owner_slug: "slug-1",
  context_owner_type: "conversation",
  impulse_conversation_id: "123",
}

describe("OpenInquiryModalButtonTestQueryRenderer", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<OpenInquiryModalButtonTestQuery>
      environment={mockEnvironment}
      query={graphql`
        query OpenInquiryModalButtonTestQuery @relay_test_operation {
          artwork(id: "artwork-id") {
            ...OpenInquiryModalButton_artwork
          }
        }
      `}
      render={({ props }) => {
        if (props?.artwork) {
          return (
            <OpenInquiryModalButtonFragmentContainer artwork={props.artwork} conversationID="123" />
          )
        }
        return null
      }}
      variables={{}}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const renderer = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, mockResolvers)
    return renderer
  }

  it("renders Purchase and Make Offer CTAs", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
    const { getByText } = getWrapper({
      Artwork: () => ({
        internalID: "fancy-art",
        slug: "slug-1",
        isAcquireable: true,
        isOfferableFromInquiry: true,
      }),
    })

    expect(getByText("Make an Offer")).toBeTruthy()
    expect(getByText("Purchase")).toBeTruthy()
  })

  describe("make offer", () => {
    it("clicking the button on unique artworks creates an offer", () => {
      relay.commitMutation = jest.fn()

      const { getByText } = getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isOfferableFromInquiry: true }),
      })

      fireEvent(getByText("Make an Offer"), "press")
      expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on artworks with one edition set creates an offer", () => {
      relay.commitMutation = jest.fn()

      const { getByText } = getWrapper({
        Artwork: () => ({
          internalID: "fancy-art",
          isEdition: true,
          editionSets: [
            {
              internalID: "an-edition-set",
            },
          ],
          isOfferableFromInquiry: true,
        }),
      })

      fireEvent.press(getByText("Make an Offer"))
      expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on non-unique artworks opens the confirmation modal", () => {
      const { getByText } = getWrapper({
        Artwork: () => ({
          internalID: "fancy-art",
          isEdition: true,
          isOfferableFromInquiry: true,
          editionSets: [
            {
              internalID: "an-edition-set",
            },
            {
              internalID: "another-edition-set",
            },
          ],
        }),
      })

      fireEvent.press(getByText("Make an Offer"))
      expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(navigate).toHaveBeenCalledWith("make-offer/fancy-art", {
        modal: true,
        passProps: { conversationID: "123" },
      })
    })
  })

  describe("purchase", () => {
    it("clicking the button on unique artworks creates an order", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
      relay.commitMutation = jest.fn()

      const { getByText } = getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isAcquireable: true }),
      })

      fireEvent(getByText("Purchase"), "press")
      expect(trackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on artworks with one edition set creates an order", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
      relay.commitMutation = jest.fn()

      const { getByText } = getWrapper({
        Artwork: () => ({
          internalID: "fancy-art",
          isEdition: true,
          editionSets: [
            {
              internalID: "an-edition-set",
            },
          ],
          isAcquireable: true,
        }),
      })

      fireEvent(getByText("Purchase"), "press")
      expect(trackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on non-unique artworks opens the confirmation modal", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
      const { getByText } = getWrapper({
        Artwork: () => ({
          internalID: "fancy-art",
          isEdition: true,
          isAcquireable: true,
          editionSets: [
            {
              internalID: "an-edition-set",
            },
            {
              internalID: "another-edition-set",
            },
          ],
        }),
      })

      fireEvent.press(getByText("Purchase"))
      expect(trackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(navigate).toHaveBeenCalledWith("purchase/fancy-art", {
        modal: true,
        passProps: { conversationID: "123" },
      })
    })
  })

  describe("Artsy guarantee message ad link", () => {
    it("display the correct message and button", () => {
      const { queryByText } = getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isOfferableFromInquiry: true }),
      })

      expect(queryByText("The Artsy Guarantee")).toBeDefined()
      expect(queryByText("Make an Offer")).toBeDefined()
    })

    it("navigates to the buyer guarantee page when tapped", () => {
      const { getByText } = getWrapper({
        Artwork: () => ({ internalID: "fancy-art" }),
      })

      fireEvent(getByText("The Artsy Guarantee"), "press")
      expect(navigate).toHaveBeenCalledWith("/buyer-guarantee")
    })
  })
})
