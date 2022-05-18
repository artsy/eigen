import { fireEvent } from "@testing-library/react-native"
import { OpenInquiryModalButtonTestQuery } from "__generated__/OpenInquiryModalButtonTestQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
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
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return renderer
  }

  it("clicking the button on unique artworks creates an offer", () => {
    relay.commitMutation = jest.fn()

    const { getAllByText } = getWrapper({
      Artwork: () => ({ internalID: "fancy-art" }),
    })

    fireEvent(getAllByText("Make an Offer")[0], "press")
    expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
    expect(relay.commitMutation).toHaveBeenCalledTimes(1)
  })

  it("clicking the button on artworks with one edition set creates an offer", () => {
    relay.commitMutation = jest.fn()

    const { getAllByText } = getWrapper({
      Artwork: () => ({
        internalID: "fancy-art",
        isEdition: true,
        editionSets: [
          {
            internalID: "an-edition-set",
          },
        ],
      }),
    })

    fireEvent(getAllByText("Make an Offer")[0], "press")
    expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
    expect(relay.commitMutation).toHaveBeenCalledTimes(1)
  })

  it("clicking the button on non-unique artworks opens the confirmation modal", () => {
    const { getAllByText } = getWrapper({
      Artwork: () => ({
        internalID: "fancy-art",
        isEdition: true,
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

    fireEvent(getAllByText("Make an Offer")[0], "press")
    expect(trackEvent).toHaveBeenCalledWith(tappedMakeOfferEvent)
    expect(navigate).toHaveBeenCalledWith("make-offer/fancy-art", {
      modal: true,
      passProps: { conversationID: "123" },
    })
  })

  describe("Artsy guarantee message ad link", () => {
    it("display the correct message and button", () => {
      const { getByText, getAllByText } = getWrapper({
        Artwork: () => ({ internalID: "fancy-art" }),
      })

      expect(getByText("The Artsy Guarantee")).toBeDefined()
      expect(getAllByText("Make an Offer")).toBeDefined()
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
