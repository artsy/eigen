import { fireEvent, screen } from "@testing-library/react-native"
import { OpenInquiryModalButtonTestQuery } from "__generated__/OpenInquiryModalButtonTestQuery.graphql"
import { OpenInquiryModalButtonFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/OpenInquiryModalButton"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import relay, { QueryRenderer, graphql } from "react-relay"

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
  flow: undefined,
}

describe("OpenInquiryModalButtonTestQueryRenderer", () => {
  const mockEnvironment = getMockRelayEnvironment()
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

  const getWrapper = async (mockResolvers = {}) => {
    const view = await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, mockResolvers)
    return view
  }

  it("renders Purchase and Make Offer CTAs", async () => {
    await getWrapper({
      Artwork: () => ({
        internalID: "fancy-art",
        slug: "slug-1",
        isAcquireable: true,
        isOfferableFromInquiry: true,
      }),
    })

    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.getByText("Purchase")).toBeTruthy()
  })

  describe("make offer", () => {
    it("clicking the button on unique artworks creates an offer", async () => {
      relay.commitMutation = jest.fn()

      await getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isOfferableFromInquiry: true }),
      })

      await fireEvent(screen.getByText("Make an Offer"), "press")
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on artworks with one edition set creates an offer", async () => {
      relay.commitMutation = jest.fn()

      await getWrapper({
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

      await fireEvent.press(screen.getByText("Make an Offer"))
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on non-unique artworks opens the confirmation modal", async () => {
      await getWrapper({
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

      await fireEvent.press(screen.getByText("Make an Offer"))
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
      expect(navigate).toHaveBeenCalledWith("make-offer/fancy-art", {
        modal: true,
        passProps: { conversationID: "123" },
      })
    })
  })

  describe("purchase", () => {
    it("clicking the button on unique artworks creates an order", async () => {
      relay.commitMutation = jest.fn()

      await getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isAcquireable: true }),
      })

      await fireEvent(screen.getByText("Purchase"), "press")
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on artworks with one edition set creates an order", async () => {
      relay.commitMutation = jest.fn()

      await getWrapper({
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

      await fireEvent(screen.getByText("Purchase"), "press")
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
    })

    it("clicking the button on non-unique artworks opens the confirmation modal", async () => {
      await getWrapper({
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

      await fireEvent.press(screen.getByText("Purchase"))
      expect(mockTrackEvent).toHaveBeenCalledWith(tappedPurchaseEvent)
      expect(navigate).toHaveBeenCalledWith("purchase/fancy-art", {
        modal: true,
        passProps: { conversationID: "123" },
      })
    })
  })

  describe("Artsy guarantee message ad link", () => {
    it("display the correct message and button", async () => {
      await getWrapper({
        Artwork: () => ({ internalID: "fancy-art", isOfferableFromInquiry: true }),
      })

      expect(screen.getByText("The Artsy Guarantee")).toBeDefined()
      expect(screen.getByText("Make an Offer")).toBeDefined()
    })

    it("navigates to the buyer guarantee page when tapped", async () => {
      await getWrapper({
        Artwork: () => ({ internalID: "fancy-art" }),
      })

      await fireEvent(screen.getByText("The Artsy Guarantee"), "press")
      expect(navigate).toHaveBeenCalledWith("/buyer-guarantee")
    })
  })
})
