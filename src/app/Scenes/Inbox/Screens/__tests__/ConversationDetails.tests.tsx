import { fireEvent, screen } from "@testing-library/react-native"
import { ConversationDetailsFragmentContainer } from "app/Scenes/Inbox/Screens/ConversationDetails"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ConversationDetailsFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ me }: any) => <ConversationDetailsFragmentContainer me={me} />,
    query: graphql`
      query ConversationDetails_Test_Query($conversationID: String!) {
        me {
          ...ConversationDetails_me
        }
      }
    `,
    variables: {
      conversationID: "test-conversation",
    },
  })

  it("render all elements", () => {
    renderWithRelay()

    expect(screen.getByText(/Order No/)).toBeDefined()
    expect(screen.getByText("Ship to")).toBeDefined()
    expect(screen.getByText("Payment Method")).toBeDefined()
    expect(screen.getByText("Attachments")).toBeDefined()
    expect(screen.getByText("Support")).toBeDefined()
    expect(screen.getByText("Inquiries FAQ")).toBeDefined()
  })

  it("does not render order information given no order/offer present", () => {
    renderWithRelay({
      Conversation: () => ({
        orderConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(screen.queryByText(/Order No/)).toBeNull()
    expect(screen.queryByText("Ship to")).toBeNull()
    expect(screen.queryByText("Payment Method")).toBeNull()
  })

  it("tracks analytics event when Inquiries FAQ link is tapped", () => {
    renderWithRelay({
      Conversation: () => ({
        internalID: "test-conversation-id",
      }),
    })

    fireEvent.press(screen.getByText("Inquiries FAQ"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedVisitHelpCenter",
      context_module: "conversations",
      context_screen_owner_id: "test-conversation-id",
      context_screen_owner_type: "conversation",
      destination_screen_owner_type: "articles",
      destination_screen_owner_slug: "0TO3b000000UevEGAS/contacting-a-gallery",
      flow: "Inquiry",
    })
  })
})
